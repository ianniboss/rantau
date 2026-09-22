"""Backend API tests for Rantau file service."""
import io
import os
import struct
import zlib
import pytest
import requests

BASE_URL = os.environ.get("REACT_APP_BACKEND_URL", "https://rantau-hub.preview.emergentagent.com").rstrip("/")
API = f"{BASE_URL}/api"


def _make_png_bytes():
    """Create a minimal 1x1 PNG in-memory."""
    sig = b"\x89PNG\r\n\x1a\n"
    def chunk(tag, data):
        return struct.pack(">I", len(data)) + tag + data + struct.pack(">I", zlib.crc32(tag + data) & 0xffffffff)
    ihdr = struct.pack(">IIBBBBB", 1, 1, 8, 2, 0, 0, 0)
    raw = b"\x00\xff\x00\x00"
    idat = zlib.compress(raw)
    return sig + chunk(b"IHDR", ihdr) + chunk(b"IDAT", idat) + chunk(b"IEND", b"")


# ---- Health / root -----------------------------------------------------
def test_api_root():
    r = requests.get(f"{API}/", timeout=15)
    assert r.status_code == 200
    data = r.json()
    assert data.get("service") == "rantau"
    assert data.get("status") == "ok"


# ---- Upload valid PNG --------------------------------------------------
@pytest.fixture(scope="module")
def uploaded_png():
    png = _make_png_bytes()
    files = {"file": ("test.png", png, "image/png")}
    data = {"uid": "TEST_qa_uid"}
    r = requests.post(f"{API}/upload", files=files, data=data, timeout=60)
    assert r.status_code == 200, f"Upload failed: {r.status_code} {r.text}"
    j = r.json()
    assert "path" in j and "url" in j and "fileType" in j
    assert j["fileType"] == "png"
    assert j["url"].startswith("/api/files/")
    return j, png


def test_upload_png_returns_metadata(uploaded_png):
    j, _ = uploaded_png
    assert j["fileType"] == "png"
    assert j["path"].startswith("rantau/uploads/TEST_qa_uid/")


def test_download_uploaded_png(uploaded_png):
    j, png_bytes = uploaded_png
    r = requests.get(f"{BASE_URL}{j['url']}", timeout=30)
    assert r.status_code == 200
    assert r.headers.get("content-type", "").startswith("image/png")
    # Body should be non-empty; ideally same length as uploaded
    assert len(r.content) > 0


# ---- Reject bad content type ------------------------------------------
def test_upload_txt_returns_415():
    files = {"file": ("hello.txt", b"hello world", "text/plain")}
    data = {"uid": "TEST_qa_uid"}
    r = requests.post(f"{API}/upload", files=files, data=data, timeout=30)
    assert r.status_code == 415


def test_download_nonexistent_404():
    r = requests.get(f"{API}/files/rantau/uploads/none/does-not-exist.png", timeout=30)
    assert r.status_code == 404
