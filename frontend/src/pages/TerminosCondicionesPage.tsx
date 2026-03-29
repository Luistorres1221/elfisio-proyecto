import InfoPageLayout from "@/components/InfoPageLayout";

const TerminosCondicionesPage = () => {
  return (
    <InfoPageLayout
      badge="Informacion legal"
      title="Terminos y Condiciones"
      summary="Estas condiciones regulan el acceso, la navegacion y el uso de la informacion publicada en este sitio web, asi como la interaccion de los usuarios con los servicios informativos de ELFISIO."
    >
      <p>
        El ingreso y uso de este sitio web implican la aceptacion de las condiciones aqui
        descritas. El usuario se compromete a hacer un uso adecuado de los contenidos,
        formularios, canales de contacto y demas funcionalidades disponibles en la
        plataforma.
      </p>
      <p>
        La informacion publicada tiene un caracter general e informativo. En consecuencia,
        no sustituye la valoracion profesional individual ni constituye por si sola una
        recomendacion clinica definitiva. Toda decision relacionada con tratamientos o
        procesos terapeuticos debe ser validada por el profesional correspondiente.
      </p>
      <p>
        ELFISIO podra actualizar, modificar o retirar contenidos, servicios, horarios,
        condiciones de acceso o elementos funcionales del sitio cuando resulte necesario
        para garantizar su adecuado funcionamiento, cumplimiento normativo o mejora continua.
      </p>
    </InfoPageLayout>
  );
};

export default TerminosCondicionesPage;
