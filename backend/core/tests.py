import os
import shutil
import tempfile

from django.conf import settings
from django.test import TestCase
from django.core.files.uploadedfile import SimpleUploadedFile

from rest_framework.test import APIClient

from core.models import CreatorUpload


class CreatorUploadApiTests(TestCase):
    @classmethod
    def setUpClass(cls):
        super().setUpClass()
        cls._temp_media_dir = tempfile.mkdtemp(prefix="scifi_media_")
        cls._old_media_root = settings.MEDIA_ROOT
        settings.MEDIA_ROOT = cls._temp_media_dir

    @classmethod
    def tearDownClass(cls):
        settings.MEDIA_ROOT = cls._old_media_root
        shutil.rmtree(cls._temp_media_dir, ignore_errors=True)
        super().tearDownClass()

    def setUp(self):
        self.client = APIClient()

    def _login_session_user(self, username: str = "testuser"):
        res = self.client.post(
            "/api/create-username/",
            {"username": username},
            format="json",
        )
        self.assertIn(res.status_code, (201, 409))
        return username

    def test_upload_requires_session_login(self):
        upload = SimpleUploadedFile("sample.pdf", b"%PDF-1.4\n%test\n", content_type="application/pdf")
        res = self.client.post(
            "/api/uploads/",
            {"title": "My Story", "file": upload},
            format="multipart",
        )
        self.assertEqual(res.status_code, 401)

    def test_upload_rejects_invalid_extension(self):
        self._login_session_user()
        upload = SimpleUploadedFile("sample.txt", b"hello", content_type="text/plain")
        res = self.client.post(
            "/api/uploads/",
            {"title": "Bad", "file": upload},
            format="multipart",
        )
        self.assertEqual(res.status_code, 400)
        self.assertIn("Only PDF, DOC, and DOCX", str(res.data))

    def test_upload_requires_title(self):
        self._login_session_user()
        upload = SimpleUploadedFile("sample.pdf", b"%PDF-1.4\n%test\n", content_type="application/pdf")
        res = self.client.post(
            "/api/uploads/",
            {"title": "", "file": upload},
            format="multipart",
        )
        self.assertEqual(res.status_code, 400)
        self.assertIn("Title is required", str(res.data))

    def test_upload_and_list_mine_and_public(self):
        username = self._login_session_user("alice")
        upload = SimpleUploadedFile("sample.pdf", b"%PDF-1.4\n%test\n", content_type="application/pdf")

        res = self.client.post(
            "/api/uploads/",
            {"title": "Nebula Drift", "file": upload},
            format="multipart",
        )
        self.assertEqual(res.status_code, 201)
        self.assertIn("upload", res.data)
        self.assertEqual(res.data["upload"]["username"], username)
        self.assertEqual(res.data["upload"]["title"], "Nebula Drift")
        self.assertTrue(res.data["upload"]["file_url"].startswith("http://testserver/"))
        self.assertIn("preview_url", res.data["upload"])

        mine = self.client.get("/api/uploads/mine/")
        self.assertEqual(mine.status_code, 200)
        self.assertEqual(len(mine.data.get("uploads", [])), 1)

        public = self.client.get("/api/uploads/public/")
        self.assertEqual(public.status_code, 200)
        self.assertGreaterEqual(len(public.data.get("uploads", [])), 1)

    def test_delete_requires_login_and_ownership(self):
        # Create upload as alice
        self._login_session_user("alice")
        upload_file = SimpleUploadedFile(
            "sample.pdf",
            b"%PDF-1.4\n%test\n",
            content_type="application/pdf",
        )
        created = self.client.post(
            "/api/uploads/",
            {"title": "To Delete", "file": upload_file},
            format="multipart",
        )
        self.assertEqual(created.status_code, 201)
        upload_id = created.data["upload"]["id"]
        self.assertEqual(CreatorUpload.objects.count(), 1)

        # Not logged in -> 401
        other = APIClient()
        res = other.delete(f"/api/uploads/{upload_id}/")
        self.assertEqual(res.status_code, 401)

        # Logged in as bob -> 403
        other.post("/api/create-username/", {"username": "bob"}, format="json")
        res = other.delete(f"/api/uploads/{upload_id}/")
        self.assertEqual(res.status_code, 403)
        self.assertEqual(CreatorUpload.objects.count(), 1)

        # Logged in as alice -> 200 and deleted
        res = self.client.delete(f"/api/uploads/{upload_id}/")
        self.assertEqual(res.status_code, 200)
        self.assertTrue(res.data.get("ok"))
        self.assertEqual(CreatorUpload.objects.count(), 0)
