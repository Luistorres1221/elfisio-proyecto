import InfoPageLayout from "@/components/InfoPageLayout";

const TratamientoDatosPage = () => {
  const companyName = "ELFISIO S.A";
  const nit = "804.531.678-4";
  const email = "atencionalcliente@elfisio.com";
  const phone = "(576) 7450000 - (57) 3017749618";
  const address = "Cra 22 calle 10A-61, Barrio Granada, Armenia, Quindio";

  return (
    <InfoPageLayout
      badge="Informacion legal"
      title="Politica de tratamiento de datos"
      summary={`Esta politica describe los lineamientos generales bajo los cuales ${companyName} recolecta, usa, almacena y protege la informacion personal de pacientes, acudientes, usuarios, trabajadores, contratistas y proveedores, en cumplimiento de la normativa colombiana aplicable.`}
    >
      <p>
        {companyName}, en calidad de responsable y/o encargado del tratamiento de datos
        personales, informa a pacientes, acudientes, usuarios, trabajadores,
        contratistas, proveedores y, en general, a todas las personas que hayan
        suministrado o lleguen a suministrar informacion personal, que dichos datos podran
        ser incorporados en bases de datos administradas por la organizacion para el
        desarrollo de sus actividades asistenciales, administrativas y comerciales.
      </p>
      <p>
        {companyName} manifiesta que, en cumplimiento de la Ley 1581 de 2012 y sus disposiciones
        reglamentarias, ha adoptado medidas legales, tecnicas y organizacionales razonables
        para proteger la informacion personal contra perdida, acceso no autorizado,
        alteracion, uso indebido o divulgacion no permitida, garantizando la seguridad,
        confidencialidad e integridad de los datos durante todo el tratamiento.
      </p>
      <p>
        Mediante la autorizacion previa, expresa e informada del titular, {companyName} podra
        recolectar, almacenar, consultar, actualizar, usar, circular internamente y, cuando
        sea procedente, transmitir o transferir datos personales para las finalidades
        relacionadas con la prestacion de servicios de fisioterapia y demas actividades
        vinculadas a su operacion.
      </p>
      <section className="rounded-2xl border border-border/60 bg-muted/30 p-6">
        <h2 className="text-2xl font-semibold text-foreground">
          Finalidades para pacientes y usuarios de terapias
        </h2>
        <div className="mt-4 space-y-3">
          <p>
            Los datos personales de pacientes, usuarios y acudientes podran ser tratados
            para las siguientes finalidades:
          </p>
          <ul className="list-disc space-y-2 pl-6">
            <li>
              Crear, actualizar y administrar historias clinicas, valoraciones, evoluciones,
              ordenes de tratamiento y registros relacionados con procesos de fisioterapia y
              rehabilitacion.
            </li>
            <li>
              Agendar, confirmar, reprogramar y cancelar citas de valoracion, control,
              seguimiento y sesiones terapeuticas.
            </li>
            <li>
              Diseñar, ejecutar y hacer seguimiento a planes de tratamiento terapeutico de
              acuerdo con la condicion funcional y las necesidades del paciente.
            </li>
            <li>
              Gestionar procesos administrativos, facturacion, pagos, cartera, soportes de
              atencion y demas tramites derivados de la prestacion del servicio.
            </li>
            <li>
              Contactar al paciente o a su acudiente por llamada, correo electronico,
              mensajeria instantanea o cualquier otro medio autorizado, para brindar
              informacion sobre citas, recomendaciones generales, continuidad del tratamiento
              y novedades del servicio.
            </li>
            <li>
              Realizar encuestas de satisfaccion, seguimiento de experiencia y evaluaciones de
              calidad del servicio prestado.
            </li>
            <li>
              Dar cumplimiento a obligaciones legales, regulatorias, contractuales y de
              reporte ante autoridades competentes, cuando haya lugar a ello.
            </li>
          </ul>
        </div>
      </section>
      <section className="rounded-2xl border border-border/60 bg-muted/30 p-6">
        <h2 className="text-2xl font-semibold text-foreground">
          Finalidades para trabajadores, contratistas y proveedores
        </h2>
        <ul className="mt-4 list-disc space-y-2 pl-6">
          <li>
            Desarrollar procesos de seleccion, vinculacion, contratacion, afiliaciones,
            pagos, capacitacion, seguridad y salud en el trabajo, bienestar y gestion de
            talento humano.
          </li>
          <li>
            Administrar expedientes, soportes documentales, acceso a instalaciones, activos y
            herramientas tecnicas o tecnologicas necesarias para la operacion.
          </li>
          <li>
            Gestionar procesos de contratacion de bienes y servicios, evaluacion de
            proveedores, pagos, cumplimiento contractual y control administrativo.
          </li>
        </ul>
      </section>
      <section className="rounded-2xl border border-border/60 bg-muted/30 p-6">
        <h2 className="text-2xl font-semibold text-foreground">Otras finalidades</h2>
        <p className="mt-3">
          De manera adicional, los datos personales podran ser utilizados para informar sobre
          servicios actuales o futuros relacionados con fisioterapia, rehabilitacion,
          prevencion, bienestar y acompanamiento terapeutico, asi como para establecer
          contacto con aliados estrategicos cuando exista una relacion comercial legitima o
          una autorizacion previa del titular.
        </p>
      </section>
      <section className="rounded-2xl border border-border/60 bg-muted/30 p-6">
        <h2 className="text-2xl font-semibold text-foreground">Derechos de los titulares</h2>
        <p className="mt-3">
          {companyName} garantiza a los titulares de la informacion los derechos de conocer,
          actualizar, rectificar y solicitar la supresion de sus datos personales, asi como
          revocar la autorizacion otorgada, en los casos previstos por la ley y conforme a
          los procedimientos internos establecidos para la atencion de consultas y reclamos.
        </p>
      </section>
      <section className="rounded-2xl border border-border/60 bg-muted/30 p-6">
        <h2 className="text-2xl font-semibold text-foreground">Canales de atencion</h2>
        <p className="mt-3">
          Para ejercer sus derechos o presentar solicitudes relacionadas con el tratamiento
          de datos personales, los titulares podran comunicarse a traves de los canales
          oficiales de contacto habilitados por {companyName}.
        </p>
        <div className="mt-4 space-y-2 rounded-xl border border-border/50 bg-background p-4 text-sm leading-7 text-foreground/90">
          <p><span className="font-semibold">Empresa:</span> {companyName}</p>
          <p><span className="font-semibold">NIT:</span> {nit}</p>
          <p><span className="font-semibold">Correo electronico:</span> {email}</p>
          <p><span className="font-semibold">Contacto telefonico:</span> {phone}</p>
          <p><span className="font-semibold">Direccion:</span> {address}</p>
        </div>
      </section>
    </InfoPageLayout>
  );
};

export default TratamientoDatosPage;
