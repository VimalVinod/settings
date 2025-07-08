async function loadEntries() {
  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .order('created_at', { ascending: false });

  const container = document.getElementById('entries');

  if (error) {
    console.error("Error loading entries:", error);
    container.innerHTML = "<p>❌ Couldn't load your diary entries.</p>";
    return;
  }

  if (!data || data.length === 0) {
    container.innerHTML = "<p>📝 No entries yet... Start writing your first memory!</p>";
    return;
  }

  data.forEach(entry => {
    const card = document.createElement('div');
    card.className = 'entry-card';

    const date = new Date(entry.created_at).toLocaleString();

    card.innerHTML = `
      <h3>${entry.title}</h3>
      <p>${entry.content}</p>
      ${entry.image_url ? `<img src="${entry.image_url}" alt="Entry Image"/>` : ''}
      <small><em>${date}</em></small>
    `;

    container.appendChild(card);
  });
}

loadEntries();
