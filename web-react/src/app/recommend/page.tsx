import { MapView } from "@/components/map/MapView";

export default function RecommendPage() {
  const limaCenter = { lat: -12.0464, lng: -77.0428 };

  return (
    <main className="space-y-3">
      <h1 className="text-2xl font-semibold">Recomendaciones</h1>
      <p className="text-slate-700">
        Placeholder: aquí irá el modo <code>nearby</code> y <code>route</code> con
        score económico.
      </p>

      <MapView
        className="pt-2"
        center={limaCenter}
        zoom={12}
        markers={[
          {
            id: "demo-1",
            position: limaCenter,
            label: "Centro (demo)",
            priceText: "S/ --",
            color: "#16a34a"
          }
        ]}
      />
    </main>
  );
}
