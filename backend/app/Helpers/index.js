'use strict'

const removeAccents = async (str) => {
  let accents = 'ÀÁÂÃÄÅàáâãäåßÒÓÔÕÕÖØòóôõöøÈÉÊËèéêëðÇçÐÌÍÎÏìíîïÙÚÛÜùúûüÑñŠšŸÿýŽž';
  let accentsOut = "AAAAAAaaaaaaBOOOOOOOooooooEEEEeeeeeCcDIIIIiiiiUUUUuuuuNnSsYyyZz";
  str = str.split('');
  str.forEach((letter, index) => {
    let i = accents.indexOf(letter);
    if (i != -1) {
      str[index] = accentsOut[i];
    }
  })
  return str.join('');
}

const slugfy = async (str) => {
  str = await removeAccents(str)
  str = str.toLowerCase()
          .trim()
          .replace(/[\s\t_]/g, '-')
          .replace(/[^a-z0-9\-]/g, '')

  return str
}

module.exports = {
  removeAccents,
  slugfy,
}
