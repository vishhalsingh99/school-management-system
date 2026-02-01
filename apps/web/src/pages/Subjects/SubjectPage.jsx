import { useState } from "react";
import SubjectCreateForm from "../../components/subjects/SubjectCreateForm";
import SubjectListTable from "../../components/subjects/SubjectListTable";
import SubjectAssignPage from "./SubjectAssignPage";

export default function SubjectPage() {
  const [selectedSubject, setSelectedSubject] = useState(null);
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Subjects</h1>

        <button
          onClick={() => setShowCreate(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl font-semibold shadow"
        >
          + Add Subject
        </button>
      </div>

      {/* CREATE SUBJECT (TOGGLE) */}
      {showCreate && (
        <div className="bg-gray-50 border rounded-2xl p-6 relative">
          <button
            onClick={() => setShowCreate(false)}
            className="absolute top-4 right-4 text-gray-500 hover:text-black"
          >
            ✕
          </button>

          <SubjectCreateForm
            onCreated={() => {
              setShowCreate(false);
            }}
          />
        </div>
      )}

      {/* SUBJECT LIST */}
      <SubjectListTable
        onSelect={(subject) => {
          setSelectedSubject(subject);
          window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
        }}
      />

      {/* ASSIGN SUBJECT */}
      {selectedSubject && (
        <div className="pt-4 border-t">
          <SubjectAssignPage subject={selectedSubject} />
        </div>
      )}
    </div>
  );
}
