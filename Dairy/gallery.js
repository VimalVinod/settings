async function loadGallery() {
  const { data, error } = await supabase.storage.from('diary-images').list('', { limit: 100 });
  if (error) {
    console.error(error);
    return;
  }
  const gallery = document.getElementById('gallery');
  data.forEach(item => {
    const url = `${SUPABASE_URL}/storage/v1/object/public/diary-images/${item.name}`;
    const img = document.createElement('img');
    img.src = url;
    img.alt = item.name;
    gallery.appendChild(img);
  });
}
loadGallery();