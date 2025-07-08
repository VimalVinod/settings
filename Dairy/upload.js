document.getElementById('entryForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const statusEl = document.getElementById('status');
  statusEl.textContent = "📤 Uploading... Please wait.";

  const image = document.getElementById('image').files[0];
  const currentUser = localStorage.getItem('diary_user');
  let image_url = '';

  if (!currentUser) {
    statusEl.textContent = "❌ User not identified.";
    return;
  }

  try {
    if (image) {
      const fileName = `${Date.now()}_${image.name}`;
      console.log("📦 File selected:", image);
      console.log("🪣 Uploading to bucket: gallery");
      console.log("📁 Final filename:", fileName);

      // Upload to BUCKET = gallery
      const { error: uploadError } = await supabase
        .storage
        .from('gallery') // ✅ Bucket name (not 'gallery_images')
        .upload(fileName, image, {
          cacheControl: '3600',
          upsert: false
        });

      if (uploadError) {
        console.error("❌ Image upload failed:", uploadError);
        statusEl.textContent = "❌ Image upload failed.";
        return;
      }

      const { data: publicData } = supabase
        .storage
        .from('gallery') // ✅ Bucket name
        .getPublicUrl(fileName);

      image_url = publicData.publicUrl;
    }

    // Insert metadata into DB table
    const { error: insertError } = await supabase
      .from('gallery_images') // ✅ Table name
      .insert([{ image_url, user: currentUser }]);

    if (insertError) {
      console.error("❌ Insert error:", insertError);
      statusEl.textContent = "❌ Failed to save image entry.";
    } else {
      statusEl.textContent = "✅ Image uploaded to gallery!";
      document.getElementById('entryForm').reset();
    }
  } catch (err) {
    console.error("💥 Unexpected error:", err);
    statusEl.textContent = "❌ Something went wrong.";
  }
});
