'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

export default function TestDatabasePage() {
  // --- STATE UNTUK FEED ---
  const [reports, setReports] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // --- STATE UNTUK FORM INPUT ---
  const [postType, setPostType] = useState<'quick_post' | 'full_report'>('full_report');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('catcalling');
  const [locationLabel, setLocationLabel] = useState('');
  const [statusChoice, setStatusChoice] = useState<'Approved' | 'Pending Review'>('Approved');
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [file, setFile] = useState<File | null>(null);

  // Fungsi untuk mengambil data yang berstatus 'Approved'
  async function fetchReports() {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('incident_reports')
        .select('*')
        .eq('status', 'Approved')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setReports(data || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchReports();
  }, []);

  // Fungsi Submit Form & Upload Media
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      let mediaUrl: string | null = null;

      // 1. Upload File ke Supabase Storage (jika file dipilih)
      if (file) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${fileExt}`;

        const { error: uploadError } = await supabase.storage
          .from('evidence_media')
          .upload(fileName, file);

        if (uploadError) {
          throw new Error(`Upload Media Gagal: ${uploadError.message}. Pastikan bucket 'evidence_media' sudah dibuat & Public!`);
        }

        // Ambil URL Publik File
        const { data: publicUrlData } = supabase.storage
          .from('evidence_media')
          .getPublicUrl(fileName);

        mediaUrl = publicUrlData.publicUrl;
      }

      // 2. Insert Data ke Tabel incident_reports
      const { error: insertError } = await supabase
        .from('incident_reports')
        .insert([
          {
            post_type: postType,
            description,
            category: postType === 'full_report' ? category : null,
            location_label: locationLabel || null,
            status: statusChoice, // Menggunakan pilihan dari form
            is_anonymous: isAnonymous,
            media_url: mediaUrl,
          },
        ]);

      if (insertError) {
        throw new Error(`Simpan Data Gagal: ${insertError.message}`);
      }

      // Reset Form
      setDescription('');
      setLocationLabel('');
      setFile(null);
      alert(`Berhasil menyimpan laporan dengan status '${statusChoice}'!`);

      // Refresh Feed di Bawah
      await fetchReports();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const containerStyle: React.CSSProperties = { maxWidth: 820, margin: '0 auto', padding: '2rem', fontFamily: 'Inter, system-ui, -apple-system, Roboto, sans-serif' };
  const cardStyle: React.CSSProperties = { border: '1px solid #e6e6e6', padding: '1.5rem', borderRadius: 12, marginBottom: '2rem', backgroundColor: '#ffffff' };
  const inputStyle: React.CSSProperties = { width: '100%', padding: '0.6rem 0.75rem', marginTop: '0.25rem', border: '1px solid #d1d5db', borderRadius: 8, fontSize: 15, boxSizing: 'border-box' };
  const labelStyle: React.CSSProperties = { display: 'block', fontWeight: 600, marginBottom: 6, color: '#111827' };
  const subtleText: React.CSSProperties = { color: '#6b7280', fontSize: '0.95rem' };

  return (
    <main style={containerStyle}>
      <h1 style={{ fontSize: 22, margin: '0 0 0.5rem 0' }}>🔍 Testing Database & Upload Media</h1>
      <p style={{ marginTop: 0, marginBottom: '1.25rem', color: '#4b5563' }}>Demo page untuk menguji penyimpanan laporan dan upload media.</p>

      {/* SECTION 1: FORM INPUT */}
      <section style={cardStyle}>
        <h2 style={{ marginTop: 0 }}>📝 Tambah Laporan Baru</h2>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={labelStyle}>Tipe Post:</label>
            <select value={postType} onChange={(e) => setPostType(e.target.value as any)} style={{ ...inputStyle, maxWidth: 320 }}>
              <option value="full_report">Full Report</option>
              <option value="quick_post">Quick Post</option>
            </select>
          </div>

          <div>
            <label style={labelStyle}>Deskripsi Kejadian:</label>
            <textarea
              required
              rows={4}
              style={{ ...inputStyle, minHeight: 90, resize: 'vertical' }}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Ceritakan kejadian di sini..."
            />
          </div>

          {postType === 'full_report' && (
            <div>
              <label style={labelStyle}>Kategori Insiden:</label>
              <select value={category} onChange={(e) => setCategory(e.target.value)} style={{ ...inputStyle, maxWidth: 420 }}>
                <option value="catcalling">Catcalling</option>
                <option value="pelecehan_fisik">Pelecehan Fisik</option>
                <option value="area_sepi">Area Sepi / Minima Penerangan</option>
                <option value="lainnya">Lainnya</option>
              </select>
            </div>
          )}

          <div>
            <label style={labelStyle}>Label Lokasi (Opsional):</label>
            <input
              type="text"
              style={inputStyle}
              value={locationLabel}
              onChange={(e) => setLocationLabel(e.target.value)}
              placeholder="Misal: Halte Busway Kampus B"
            />
          </div>

          <div>
            <label style={labelStyle}>Upload Bukti (Foto/Video Opsional):</label>
            <input
              type="file"
              accept="image/*,video/mp4"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              style={{ marginTop: '0.25rem' }}
            />
          </div>

          {/* TESTING OPTIONS */}
          <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: 8, border: '1px solid #e6eef8' }}>
            <p style={{ margin: 0, fontWeight: 700, color: '#0f172a' }}>⚙️ Opsi Pengujian Status:</p>

            <div style={{ marginTop: '0.6rem' }}>
              <label style={labelStyle}>Status Moderasi:</label>
              <select value={statusChoice} onChange={(e) => setStatusChoice(e.target.value as any)} style={{ ...inputStyle, maxWidth: 420 }}>
                <option value="Approved">Approved (Langsung Muncul di Feed)</option>
                <option value="Pending Review">Pending Review (Tersembunyi dari Feed)</option>
              </select>
            </div>

            <div style={{ marginTop: '0.5rem' }}>
              <label style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 8 }}>
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                />
                <span style={{ fontWeight: 600 }}>Laporkan Secara Anonim</span>
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <button
              type="submit"
              disabled={submitting}
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: submitting ? '#9ca3af' : '#0066d6',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontWeight: 700,
                cursor: submitting ? 'not-allowed' : 'pointer'
              }}
            >
              {submitting ? 'Sedang Mengirim & Upload File...' : '🚀 Submit Laporan'}
            </button>
          </div>
        </form>
      </section>

      {/* ERROR MESSAGE */}
      {error && (
        <div style={{ padding: '1rem', backgroundColor: '#fff1f2', color: '#831843', borderRadius: 8, marginBottom: '2rem', border: '1px solid #fbcfe8' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {/* SECTION 2: APPROVED FEEDS */}
      <section>
        <h2 style={{ marginBottom: 6 }}>📢 Approved Feed (Publik)</h2>
        <p style={subtleText}>
          Hanya laporan yang berstatus <strong>'Approved'</strong> yang akan ditampilkan di bawah ini.
        </p>

        {loading ? (
          <p style={subtleText}>Sedang memuat feed...</p>
        ) : reports.length === 0 ? (
          <p style={{ fontStyle: 'italic', color: '#9ca3af' }}>Belum ada laporan berstatus 'Approved'. Coba kirim laporan baru di atas dengan status 'Approved'.</p>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.75rem' }}>
            {reports.map((report) => (
              <div
                key={report.id}
                style={{
                  border: '1px solid #eef2f7',
                  padding: '1rem',
                  borderRadius: 10,
                  backgroundColor: '#ffffff',
                  boxShadow: '0 6px 18px rgba(15,23,42,0.03)'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span style={{ fontSize: 13, backgroundColor: '#eef2ff', color: '#3730a3', padding: '0.25rem 0.5rem', borderRadius: 6, fontWeight: 700, textTransform: 'capitalize' }}>
                    {report.post_type}
                  </span>
                  <span style={{ fontSize: 13, color: '#6b7280' }}>
                    {new Date(report.created_at).toLocaleString('id-ID')}
                  </span>
                </div>

                <p style={{ fontSize: 16, margin: '0.5rem 0', color: '#111827' }}>{report.description}</p>

                {report.category && (
                  <p style={{ margin: '0.25rem 0', fontSize: 14, color: '#92400e' }}>
                    🏷️ <strong>Kategori:</strong> {report.category}
                  </p>
                )}

                {report.location_label && (
                  <p style={{ margin: '0.25rem 0', fontSize: 14, color: '#374151' }}>
                    📍 <strong>Lokasi:</strong> {report.location_label}
                  </p>
                )}

                {report.media_url && (
                  <div style={{ marginTop: '0.75rem' }}>
                    <p style={{ margin: '0 0 0.25rem 0', fontSize: 13, fontWeight: 700 }}>Bukti Media:</p>
                    {report.media_url.match(/\.(mp4|webm)$/i) ? (
                      <video src={report.media_url} controls style={{ width: '100%', maxHeight: 360, borderRadius: 8 }} />
                    ) : (
                      <img src={report.media_url} alt="Bukti Laporan" style={{ width: '100%', maxHeight: 360, borderRadius: 8, objectFit: 'cover' }} />
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}