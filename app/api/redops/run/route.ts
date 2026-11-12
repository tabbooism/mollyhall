import { NextRequest, NextResponse } from 'next/server';
import { exec } from 'child_process';
import path from 'path';
import { REDOPS_AVAILABLE_MODULES, FORTRESS_OPS_SCRIPTS } from '@/lib/redops-modules';

export async function GET() {
  return NextResponse.json({
    framework: 'RedOps Framework (Ashes2Ashley / MaxPayne)',
    version: '4.2.0',
    available_modules: REDOPS_AVAILABLE_MODULES,
    fortress_scripts: FORTRESS_OPS_SCRIPTS,
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { module: moduleName, target, scriptType, config } = body;

    const safeTarget = (target || 'runehall.com').trim().replace(/[^a-zA-Z0-9.-]/g, '');
    const startTime = Date.now();

    const engineDir = path.join(process.cwd(), 'redops-engine');

    let command = '';
    if (scriptType === 'ops-script') {
      const scriptFile = (moduleName || 'dangling_dns.py').replace(/[^a-zA-Z0-9_.-]/g, '');
      command = `python3 ops-scripts/${scriptFile} ${safeTarget}`;
    } else {
      const safeModule = (moduleName || 'recon_report').replace(/[^a-zA-Z0-9_]/g, '');
      let setArgs = '';
      if (config && typeof config === 'object') {
        for (const [k, v] of Object.entries(config)) {
          const safeK = String(k).replace(/[^a-zA-Z0-9_]/g, '');
          const safeV = String(v).replace(/[^a-zA-Z0-9_.-]/g, '');
          setArgs += ` --set ${safeK}=${safeV}`;
        }
      }
      command = `python3 main.py run -m ${safeModule} -t ${safeTarget} --allow-all${setArgs}`;
    }

    return new Promise<NextResponse>((resolve) => {
      exec(command, { cwd: engineDir, timeout: 20000 }, (error, stdout, stderr) => {
        const durationMs = Date.now() - startTime;
        let parsedJson = null;

        // Try extracting JSON from output if module output contains JSON
        if (stdout) {
          const jsonMatch = stdout.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            try {
              parsedJson = JSON.parse(jsonMatch[0]);
            } catch {
              // fallback
            }
          }
        }

        resolve(
          NextResponse.json({
            success: !error || !error.killed,
            command,
            module: moduleName,
            target: safeTarget,
            durationMs,
            stdout: stdout || '',
            stderr: stderr || '',
            data: parsedJson,
            error: error ? error.message : null,
          })
        );
      });
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || 'Execution error' },
      { status: 500 }
    );
  }
}
