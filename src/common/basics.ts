const timeLookupTable = {
  MS: { MS: 1,           S: 1 / 1000, M: 1 / 60000, H: 1 / 3600000, D: 1 / 86400000, Y: 1 / 31536000000 },
  S:  { MS: 1000,        S: 1,        M: 1 / 60,    H: 1 / 3600,    D: 1 / 86400,    Y: 1 / 31536000 },
  M:  { MS: 60000,       S: 60,       M: 1,         H: 1 / 60,      D: 1 / 1440,     Y: 1 / 525600 },
  H:  { MS: 3600000,     S: 3600,     M: 60,        H: 1,           D: 1 / 24,       Y: 1 / 8760 },
  D:  { MS: 86400000,    S: 86400,    M: 1440,      H: 24,          D: 1,            Y: 1 / 365 },
  Y:  { MS: 31536000000, S: 31536000, M: 525600,    H: 8760,        D: 365,          Y: 1 }
};

type TimeUnit = keyof typeof timeLookupTable;
type IPv4Unit = 'SDD' | 'HEX' | '_32';

function timeConversion(input: number, FROM: TimeUnit, TO: TimeUnit) {
    return input * timeLookupTable[FROM][TO];
}



function SDD_to_32bit(ip: string){
  let parts = ip.split('.').map(Number);
  return parts[0] * 16777216 + parts[1] * 65536 + parts[2] * 256 + parts[3];
}

function _32bit_to_SDD(ip: string){
  let intIp = parseInt(ip, 10);
  let parts = [
    (intIp >> 24) & 255,
    (intIp >> 16) & 255,
    (intIp >> 8) & 255,
    intIp & 255
  ];
  return parts.join('.');
}

function _32bit_to_hex(ip: string){
  return '0x' + (parseInt(ip, 10) >>> 0).toString(16).padStart(8, '0');
}

function SDD_to_hex(ip: string){
  let intIp = SDD_to_32bit(ip);
  return _32bit_to_hex(intIp.toString());
}

function hex_to_32bit(ip: string){
  return parseInt(ip, 16) >>> 0;
}

function hex_to_SDD(ip: string){
  let intIp = hex_to_32bit(ip);
  return _32bit_to_SDD(intIp.toString());
}

function ipv4Conversion(ip: string, FROM: IPv4Unit, TO: IPv4Unit) {
  const ipv4Lookuptable = {
    SDD: {SDD: ip,                HEX: SDD_to_hex(ip),    _32: SDD_to_32bit(ip) },
    HEX: {SDD: hex_to_SDD(ip),    HEX: ip,                _32: hex_to_32bit(ip) },
    _32: {SDD: _32bit_to_SDD(ip), HEX: _32bit_to_hex(ip), _32: ip }
  }
  return ipv4Lookuptable[FROM][TO];
}

console.log(ipv4Conversion('192.168.0.1', 'SDD', 'HEX'))