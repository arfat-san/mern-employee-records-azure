
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL || "";

function displayLevel(level) {
  if (!level) return "";

  const normalized = level.toString().trim().toLowerCase();

  if (normalized === "intern") return "Intern";
  if (normalized === "junior") return "Junior";
  if (normalized === "senior") return "Senior";

  return level;
}

const Record = (props) => (
  <tr className="border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted">
    <td className="p-4 align-middle">
      {props.record.name}
    </td>
    <td className="p-4 align-middle">
      {props.record.position}
    </td>
    <td className="p-4 align-middle">
      {displayLevel(props.record.level)}
    </td>
    <td className="p-4 align-middle">
      <div className="flex gap-2">
        <Link
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium border border-input bg-background hover:bg-slate-100 h-9 rounded-md px-3"
          to={`/edit/${props.record._id}`}
        >
          Edit
        </Link>

        <button
          className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium border border-input bg-background hover:bg-slate-100 hover:text-accent-foreground h-9 rounded-md px-3"
          type="button"
          onClick={() => props.deleteRecord(props.record._id)}
        >
          Delete
        </button>
      </div>
    </td>
  </tr>
);

export default function RecordList() {
  const [records, setRecords] = useState([]);

  useEffect(() => {
    async function getRecords() {
      try {
        const response = await fetch(`${API_URL}/record/`);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        setRecords(data);
      } catch (error) {
        console.error("Error fetching employee records:", error);
      }
    }

    getRecords();
  }, []);

  async function deleteRecord(id) {
    try {
      const response = await fetch(`${API_URL}/record/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      setRecords((previousRecords) =>
        previousRecords.filter((record) => record._id !== id)
      );
    } catch (error) {
      console.error("Error deleting employee record:", error);
    }
  }

  function recordList() {
    return records.map((record) => (
      <Record
        record={record}
        deleteRecord={deleteRecord}
        key={record._id}
      />
    ));
  }

  return (
    <>
      <h3 className="text-lg font-semibold p-4">Employee Records</h3>

      <div className="border rounded-lg overflow-hidden">
        <div className="relative w-full overflow-auto">
          <table className="w-full caption-bottom text-sm">
            <thead className="[&_tr]:border-b">
              <tr className="border-b">
                <th className="h-12 px-4 text-left">Name</th>
                <th className="h-12 px-4 text-left">Position</th>
                <th className="h-12 px-4 text-left">Level</th>
                <th className="h-12 px-4 text-left">Action</th>
              </tr>
            </thead>

            <tbody className="[&_tr:last-child]:border-0">
              {recordList()}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
