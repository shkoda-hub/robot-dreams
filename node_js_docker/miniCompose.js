import {spawn} from 'node:child_process';
import { readFile } from 'node:fs/promises';

async function main() {
  const data = await readDeclaration();
  let declaration;

  try {
    declaration = JSON.parse(data);
  } catch {
    console.error('Invalid declaration json');
    process.exit(1);
  }

  const arg = process.argv.slice(2)[0];
  if (!arg) {
    console.error('Please specify a valid argument: up or down');
    return;
  }

  const network = declaration.network || 'mini_default';
  const services = Object.entries(declaration.services);

  if (arg === 'down') {
    for (const [serviceName] of services) {
      await stopContainer(serviceName);
      await removeContainer(serviceName);
    }
    await removeNetwork(network);
    return;
  }

  await createNetwork(network);

  for (const [serviceName, serviceDeclaration] of services) {
    await buildService(serviceName, serviceDeclaration);
  }

  for (const [serviceName, serviceDeclaration] of services) {
    await runService(serviceName, serviceDeclaration, network);
  }
}

async function readDeclaration(pathToDeclaration = './miniCompose.json') {
  return await readFile(pathToDeclaration, { encoding: 'utf8' });
}

async function buildService(serviceName, serviceDeclaration) {
  const args = [
    'build',
    '--file',
    `${serviceDeclaration.build}/Dockerfile`,
    '--tag',
    `${serviceName}:local`,
    '.'
  ];
  await exec('docker', args);
}


async function runService(serviceName, serviceDeclaration, network) {
  const args =  ['run', '-d', '--name', serviceName];

  if (serviceDeclaration.ports) {
    for (const [hostPort, containerPort ] of Object.entries(serviceDeclaration.ports)) {
      args.push('-p', `${hostPort}:${containerPort}`);
    }
  }

  if (serviceDeclaration.env) {
    for (const [key, value ] of Object.entries(serviceDeclaration.env)) {
      args.push('-e', `${key}=${value}`);
    }
  }

  if (serviceDeclaration.volumes) {
    for (const [hostPath, containerPath] of Object.entries(serviceDeclaration.volumes)) {
      args.push('-v', `${hostPath}:${containerPath}`);
    }
  }

  args.push('--net', network);
  args.push(`${serviceName}:local`);
  await exec('docker', args);
}

async function stopContainer(containerName){
  await exec('docker', ['stop', containerName]);
}

async function removeContainer(containerName){
  await exec('docker', ['rm', containerName]);
}

async function createNetwork(networkName) {
  await exec('docker', ['network', 'create', networkName]);
}

async function removeNetwork(networkName) {
  await exec('docker', ['network', 'rm', networkName]);
}

async function exec(command, args = []) {
  console.log(`> ${command} ${args.join(' ')}`);
  return new Promise((resolve, reject) => {
    const childProcess = spawn(command, args, { stdio: 'inherit' });
    childProcess.on('error', err => reject(err));
    childProcess.on('close', code => code === 0 ? resolve() : reject(new Error(`${command} exited ${code}`)));
  });
}

await main();
