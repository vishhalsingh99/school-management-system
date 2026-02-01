export default function QuickActions() {
  const actions = [
    { title: "New Admission", icon: "➕", link: "/admission", desc: "Add a new student" },
    { title: "Manage Classes", icon: "📚", link: "/classes", desc: "Classes & sections" },
    { title: "Add Teacher", icon: "👩‍🏫", link: "/teachers", desc: "Register faculty" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Quick Actions</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {actions.map((a) => (
          <a
            key={a.title}
            href={a.link}
            className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition text-center"
          >
            <div className="text-5xl mb-4">{a.icon}</div>
            <h3 className="text-xl font-semibold">{a.title}</h3>
            <p className="text-gray-500 mt-2">{a.desc}</p>
          </a>
        ))}
      </div>
    </div>
  );
}
