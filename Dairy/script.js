async function loadEntries(user) {
  const container = document.getElementById('entries');
  container.innerHTML = "<p>⏳ Loading your memories...</p>";

  const { data, error } = await supabase
    .from('entries')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error("Error loading entries:", error);
    container.innerHTML = "<p>❌ Couldn't load your diary entries.</p>";
    return;
  }

  if (!data || data.length === 0) {
    container.innerHTML = "<p>📝 No entries yet... Start writing your first memory!</p>";
    return;
  }

  container.innerHTML = ''; // clear loading text

  const filtered = data.filter(entry =>
    entry.user === user || entry.visibility === "shared"
  );

  if (filtered.length === 0) {
    container.innerHTML = "<p>📝 Nothing here yet. Add your first memory!</p>";
    return;
  }

  filtered.forEach(entry => {
    const card = document.createElement('div');
    card.className = 'entry-card';

    const date = new Date(entry.created_at).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });

    const isPrivate = entry.visibility === "private";
    const visibilityLabel = isPrivate ? "🔒 Private" : "🌍 Shared";

    card.innerHTML = `
      <h3>${entry.title}</h3>
      <p>${entry.content}</p>
      ${entry.image_url ? `<img src="${entry.image_url}" alt="Entry Image"/>` : ''}
      <small><em>${date}</em> • ${visibilityLabel}</small>
    `;

    container.appendChild(card);
  });
}
