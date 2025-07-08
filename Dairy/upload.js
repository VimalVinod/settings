document.getElementById('entryForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const statusEl = document.getElementById('status');
  statusEl.textContent = "📤 Uploading... Please wait.";

  const title = document.getElementById('title').value;
  const content = document.getElementById('content').value;
  const image = document.getElementById('image').files[0];
  let image_url = '';

  try {
    if (image) {
      const fileName = `${Date.now()}_${image.name}`;
      console.log("📦 File selected:", image);
      console.log("🪣 Uploading to bucket: diary-images");
      console.log("📁 Final filename:", fileName);

      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('diary-images')
        .upload(fileName, image, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error("❌ Image upload failed:", JSON.stringify(uploadError, null, 2));
        statusEl.textContent = "❌ Image upload failed.";
        return;
      }

      const { data: publicData, error: publicUrlError } = supabase
        .storage
        .from('diary-images')
        .getPublicUrl(fileName);

      if (publicUrlError) {
        console.error("❌ Failed to get public URL:", JSON.stringify(publicUrlError, null, 2));
        statusEl.textContent = "❌ Failed to get image URL.";
        return;
      }

      image_url = publicData.publicUrl;
    }

    const { error: insertError } = await supabase
      .from('entries')
      .insert([{ title, content, image_url }]);

    if (insertError) {
      console.error("❌ Entry insert error:", JSON.stringify(insertError, null, 2));
      statusEl.textContent = "❌ Failed to save entry.";
    } else {
      statusEl.textContent = "✅ Entry saved successfully!";
      document.getElementById('entryForm').reset();
    }
  } catch (err) {
    console.error("💥 Unexpected error:", err);
    statusEl.textContent = "❌ Something went wrong.";
  }
});
