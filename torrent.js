import WebTorrent from 'webtorrent';
import fs from 'fs';
import path from 'path';
import minimist from 'minimist';
import { fileURLToPath } from 'url';

const args = minimist(process.argv.slice(2), {
    string: ['port', 'path'],
    alias: { p: 'port', o: 'path' },
    default: { path: process.cwd() }
});

if (!args._[0]) {
    console.log('Usage: node torrent-client.js <torrent-file|magnet-link> [options]');
    console.log('Options:');
    console.log('  -p, --port  Specify port number');
    console.log('  -o, --path  Output directory (default: current directory)');
    process.exit(1);
}

const client = new WebTorrent({
    dht: true,
    tracker: true,
    webSeeds: true,
    port: args.port || 6881
});

const torrentId = args._[0];
const outputPath = path.resolve(args.path);

// Проверка существования директории
if (!fs.existsSync(outputPath)) {
    console.error(`Directory does not exist: ${outputPath}`);
    process.exit(1);
}

console.log(`Downloading: ${torrentId}`);
console.log(`Output path: ${outputPath}`);

client.add(torrentId, { path: outputPath }, torrent => {
    console.log(`Client is downloading: ${torrent.name}`);

    const interval = setInterval(() => {
        console.log(`Progress: ${(torrent.progress * 100).toFixed(1)}%`);
        console.log(`Download speed: ${prettyBytes(torrent.downloadSpeed)}/s`);
        console.log(`Peers: ${torrent.numPeers}`);
        console.log('---');
    }, 1000);

    torrent.on('done', () => {
        console.log('Download complete!');
        clearInterval(interval);
        client.destroy();
    });

    torrent.on('error', err => {
        console.error('Torrent error:', err);
        client.destroy();
    });
});

client.on('error', err => {
    console.error('Client error:', err);
    client.destroy();
});

// Функция для форматирования размера файла
function prettyBytes(bytes) {
    if (bytes === 0) return '0 B';
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(1024));
    return `${(bytes / Math.pow(1024, i)).toFixed(1)} ${units[i]}`;
}