function normalizeAuthor(name) {
  return name
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/'/g, '')
    .replace(/\W/g, '-')
    .replace(/(-)+/g, '-')
    .replace(/(-)$/, '');
}

module.exports = { normalizeAuthor };
