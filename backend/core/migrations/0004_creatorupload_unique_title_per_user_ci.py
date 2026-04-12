from django.db import migrations, models
from django.db.models.functions import Lower


def _dedupe_creatorupload_titles(apps, schema_editor):
    CreatorUpload = apps.get_model("core", "CreatorUpload")

    # Ensure existing rows won't violate the new (username, lower(title)) uniqueness.
    seen = set()
    qs = CreatorUpload.objects.all().order_by("username", "created_at", "id")
    for upload in qs.iterator():
        title = (upload.title or "").strip()
        if not title:
            title = f"Untitled {upload.id}"

        key = (upload.username or "", title.lower())
        if key in seen:
            base = title
            # Make it unique deterministically.
            title = f"{base} ({upload.id})"
            # Keep within CharField(max_length=255)
            if len(title) > 255:
                title = title[:240] + f" ({upload.id})"

        if upload.title != title:
            upload.title = title
            upload.save(update_fields=["title"])

        seen.add((upload.username or "", (upload.title or "").strip().lower()))


class Migration(migrations.Migration):

    dependencies = [
        ("core", "0003_creatorupload_preview_pdf"),
    ]

    operations = [
        migrations.RunPython(_dedupe_creatorupload_titles, migrations.RunPython.noop),
        migrations.AddConstraint(
            model_name="creatorupload",
            constraint=models.UniqueConstraint(
                Lower("title"),
                "username",
                name="uniq_creatorupload_title_per_user_ci",
            ),
        ),
    ]
