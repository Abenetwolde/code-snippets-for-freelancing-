// app/apps/supabase-examples/page.tsx
import Link from "next/link";

export default function SupabaseExamples() {
  const examples = [
    { title: "Authentication", path: "/apps/supabase-examples/examples/authentication" },
    { title: "Role-Based Access", path: "/apps/supabase-examples/examples/role-based-access" },
    { title: "Storage", path: "/apps/supabase-examples/examples/storage" },
    { title: "Realtime Chat", path: "/apps/supabase-examples/examples/realtime-chat" },
  ];

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Supabase Examples</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {examples.map((example) => (
          <Link
            key={example.path}
            href={example.path}
            className="block p-4 border border-gray-200 rounded-lg hover:shadow-lg transition-shadow"
          >
            <h2 className="text-xl font-semibold mb-2">{example.title}</h2>
            <p className="text-gray-600">View this Supabase example</p>
          </Link>
        ))}
      </div>
    </div>
  );
}