import {
  useEffect,
  useState
} from "react";

import {
  useNavigate
} from "react-router-dom";

import "./style.css";


export default function Loading() {
  const navigate = useNavigate();

  const [
    progress,
    setProgress
  ] = useState(0);


  useEffect(() => {

    /*
     * Pré-carrega o código da Home
     * enquanto a animação do Loading
     * está acontecendo.
     *
     * Isso NÃO chama nenhuma API.
     * Apenas baixa/prepara o arquivo JS
     * da página Home.
     */
    import("../Home/index");


    const duration = 3200;

    const intervalTime = 32;

    const increment =
      100 /
      (duration / intervalTime);


    const interval =
      setInterval(() => {

        setProgress(
          (currentProgress) => {

            const nextProgress =
              currentProgress +
              increment;


            if (
              nextProgress >= 100
            ) {

              clearInterval(
                interval
              );

              return 100;
            }


            return nextProgress;
          }
        );

      }, intervalTime);


    const timer =
      setTimeout(() => {

        navigate(
          "/home",
          {
            replace: true
          }
        );

      }, duration);


    return () => {

      clearInterval(
        interval
      );

      clearTimeout(
        timer
      );

    };

  }, [navigate]);


  return (
    <main className="loading-page">

      <div
        className="
          loading-background-glow
          loading-background-glow-one
        "
      />


      <div
        className="
          loading-background-glow
          loading-background-glow-two
        "
      />


      <section
        className="loading-content"
      >

        <div
          className="loading-logo-wrapper"
        >

          <h1
            className="loading-logo-base"
          >
            BCI
          </h1>


          <h1
            className="loading-logo-fill"
            aria-hidden="true"
          >
            BCI
          </h1>

        </div>


        <p
          className="loading-brand-name"
        >
          BEYOND COMPARE INTELLIGENCE
        </p>


        <div
          className="loading-status"
        >

          <div
            className="loading-progress-info"
          >

            <span>
              Carregando competitividade
            </span>


            <strong>
              {Math.round(progress)}%
            </strong>

          </div>


          <div
            className="loading-progress"
          >

            <span
              style={{
                width:
                  `${progress}%`
              }}
            />

          </div>

        </div>

      </section>


      <footer
        className="loading-footer"
      >

        <span>
          EQUIPE LUMEN
        </span>

        <div />

        <span>
          BCI 2026
        </span>

      </footer>

    </main>
  );
}