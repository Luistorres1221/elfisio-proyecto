import InfoPageLayout from "@/components/InfoPageLayout";

const PoliticaCookiesPage = () => {
  return (
    <InfoPageLayout
      badge="Informacion legal"
      title="Politica de cookies"
      summary="Esta politica explica el uso de cookies y tecnologias similares dentro del sitio web de ELFISIO, asi como las opciones de configuracion disponibles para el usuario."
    >
      <p>
        El sitio web de ELFISIO puede utilizar cookies tecnicas, funcionales y de analitica
        basica con el fin de facilitar la navegacion, recordar ciertas preferencias del
        usuario y optimizar el rendimiento general de la plataforma.
      </p>
      <p>
        Las cookies empleadas no tienen por objeto realizar usos indebidos de la informacion
        personal. Su tratamiento se limita a finalidades relacionadas con la operacion del
        sitio, la mejora de la experiencia de uso y el correcto funcionamiento de los
        servicios digitales ofrecidos.
      </p>
      <p>
        En los casos en que el uso de cookies implique recoleccion o tratamiento de datos
        personales, ELFISIO actuara conforme a los principios y deberes establecidos en la
        Ley 1581 de 2012 de la Republica de Colombia y demas normas que la reglamentan,
        garantizando confidencialidad, uso autorizado y proteccion adecuada de la
        informacion del titular.
      </p>
      <p>
        El usuario puede aceptar, bloquear o eliminar las cookies a traves de la
        configuracion de su navegador. Debe tenerse en cuenta que la desactivacion de
        determinadas cookies podria afectar parcial o totalmente algunas funcionalidades del
        sitio web.
      </p>
    </InfoPageLayout>
  );
};

export default PoliticaCookiesPage;
