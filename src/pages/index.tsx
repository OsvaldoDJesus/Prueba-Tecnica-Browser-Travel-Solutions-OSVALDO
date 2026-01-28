import { SearchForm } from '@/components/SearchForm/SearchForm';

export default function Home() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
      <main style={{ maxWidth: '700px', width: '100%' }}>
        <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '3rem', fontWeight: '900', letterSpacing: '-0.05em', color: '#0f172a', marginBottom: '1rem' }}>
            Outlet Rental Cars
          </h1>
          <p style={{ color: '#64748b', fontSize: '1.25rem', fontWeight: '500' }}>
            Encuentra el vehículo perfecto para tu próximo viaje en segundos.
          </p>
        </header>

        <section style={{ background: 'white', padding: '2rem', borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)' }}>
          <SearchForm />
        </section>
      </main>
    </div>
  );
}
