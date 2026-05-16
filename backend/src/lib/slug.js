function slugify(text) {
  return String(text || '')
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

async function uniqueSlug(base, findExisting) {
  let slug = slugify(base);
  if (!slug) slug = 'item';
  let candidate = slug;
  let n = 1;
  while (await findExisting(candidate)) {
    candidate = `${slug}-${n}`;
    n += 1;
  }
  return candidate;
}

module.exports = { slugify, uniqueSlug };
