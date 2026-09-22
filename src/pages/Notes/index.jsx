import Navbar from "../../components/Navbar/Navbar";

import SectionLoader from "@/components/SectionLoader/index.jsx";

import NotesGrid from "./sections/Grid";
import NotesHeader from "./sections/Header";
import NotesToolbar from "./sections/Toolbar";

import useNotesController from "./hooks/useNotesController";

import "./style.css";


export default function Notes() {
  const controller =
    useNotesController();


  return (
    <main className="notes-page">

      <Navbar />


      <section className="notes-container">

        {/* =====================================================
            HEADER
        ====================================================== */}

        <NotesHeader />


        {/* =====================================================
            TOOLBAR
        ====================================================== */}

        <NotesToolbar
          search={
            controller.search
          }
          onSearch={
            controller.setSearch
          }
        />


        {/* =====================================================
            ANOTAÇÕES
        ====================================================== */}

        {controller.loading ? (

          <SectionLoader
            message="Carregando anotações"
          />

        ) : (

          <NotesGrid
            notes={
              controller.filteredNotes
            }
            search={
              controller.search
            }
            onDelete={
              controller.handleDelete
            }
          />

        )}

      </section>

    </main>
  );
}