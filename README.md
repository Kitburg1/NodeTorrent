# Torrent Client on CLI!
  At first, you need download all dependencies: `npm i webtorrent minimist`.
  
  The next step is to launch the program using the command: 
  
  for magnet `node torrent.js magnet:?xt=urn:btih:"your magnet link" --path "your path"`.
  
  for file `node torrent.js "your file" -o "your path"`.
  
  example: for file `node torrent-client.js file.torrent -o ./downloads`.
  
  example: for magnet link `node torrent-client.js magnet:?xt=urn:btih:1234567890abcde123dn=yourtorrent --path ~/Downloads`.
