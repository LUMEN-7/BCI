import Navbar from "../../components/Navbar/Navbar";
import NotesGrid from "./sections/Grid";
import NotesHeader from "./sections/Header";
import NotesToolbar from "./sections/Toolbar";
import useNotesController from "./hooks/useNotesController";
import "./style.css";

export default function Notes() {
  const controller = useNotesController();

  return (
    <main className="notes-page">
      <Navbar />
      <section className="notes-container">
        <NotesHeader onCreate={controller.handleCreate} />
        <NotesToolbar
          search={controller.search}
          onSearch={controller.setSearch}
        />
        <NotesGrid
          notes={controller.filteredNotes}
          search={controller.search}
          onDelete={controller.handleDelete}
          onOpen={controller.handleOpen}
          onCreate={controller.handleCreate}
        />
      </section>
    </main>
  );
}
