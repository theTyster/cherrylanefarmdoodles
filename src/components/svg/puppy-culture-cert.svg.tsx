import * as React from "react";
import type { SVGProps } from "react";
interface SVGRProps {
  title?: string;
  titleId?: string;
  desc?: string;
  descId?: string;
}
const SvgPuppyCultureCert = ({
  title,
  titleId,
  desc,
  descId,
  ...props
}: SVGProps<SVGSVGElement> & SVGRProps) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 1038 370"
    fill="none"
    aria-labelledby={titleId}
    aria-describedby={descId}
    {...props}
  >
    {desc ? <desc id={descId}>{desc}</desc> : null}
    {title ? <title id={titleId}>{title}</title> : null}
    <path stroke="#46403a" strokeWidth={10} d="M100 90h70v70h-70z" />
    <path
      fill="#426932"
      stroke="#D3E8CA"
      strokeWidth={4.35}
      d="M277.204 3.939c-17.715.253-34.45 6.25-49.526 15.422-20.102 12.229-37.586 30.05-52.136 48.317-17.184 21.575-29.655 42.933-37.527 57.619-.399-1.302-.654-2.542-1.157-3.867-2.335-6.154-5.912-12.598-11.669-17.655s-13.787-8.471-23.534-8.471a6.526 6.526 0 0 0 0 13.05c6.882 0 11.324 2.065 14.92 5.225 3.598 3.16 6.258 7.675 8.081 12.48 3.645 9.607 3.733 19.6 3.733 19.6a6.525 6.525 0 0 0 12.47 2.686s17.01-37.531 44.89-72.536c13.941-17.503 30.572-34.264 48.712-45.3s37.453-16.396 58.063-12.045a6.53 6.53 0 0 0 4.907-.918 6.55 6.55 0 0 0 2.828-4.119 6.5 6.5 0 0 0-.923-4.908 6.52 6.52 0 0 0-4.115-2.823 81.4 81.4 0 0 0-18.017-1.757Z"
    />
    <path
      fill="#46403a"
      d="M265.704 151.408h4.8q0 4.928-2.496 7.296t-6.08 2.368q-5.952 0-9.472-4.16-3.52-4.224-6.464-14.528-1.792-.32-4.096-1.216v14.4h5.568v4.8h-17.216v-4.8h6.208V119.92q-7.808.576-11.072 2.752-3.264 2.177-3.264 5.952 0 1.92.832 3.2.832 1.216 2.432 1.216 3.008 0 3.008-5.056h5.12q0 4.16-1.92 7.04-1.92 2.816-6.208 2.816t-6.336-2.688-2.048-6.528q0-6.272 5.952-9.984t18.176-3.712 17.792 3.904 5.568 10.176q0 6.208-3.648 9.728t-9.408 3.904q2.112 7.36 4.48 10.496t5.376 3.136q1.92 0 3.136-1.28 1.28-1.344 1.28-3.584m-23.808-31.68v16.704q3.008 1.408 8.256 1.408 3.648 0 6.272-2.368 2.624-2.432 2.624-6.208 0-4.608-3.968-7.04-3.968-2.496-13.184-2.496m40.307 41.28q-4.416 0-6.912-2.496-2.496-2.56-2.496-6.784 0-4.288 3.328-7.168t9.856-2.88h6.976v-3.264q0-5.888-5.632-5.888-4.736 0-8.704 1.152v4.288h-4.48v-7.616q2.88-1.217 6.784-1.92 3.968-.704 6.592-.704 5.12 0 8 2.944 2.88 2.88 2.88 7.744v18.112h5.248v2.688q-2.368 1.472-5.44 1.472t-4.16-1.024-1.088-3.456q-4.8 4.8-10.752 4.8m.576-4.8q5.504 0 10.176-6.208v-4.096h-7.04q-3.904 0-5.824 1.536-1.856 1.536-1.856 3.904 0 2.304 1.152 3.584t3.392 1.28m24.158-23.68v-4.16h10.368v27.84h5.568v4.16h-16v-4.16h4.992v-23.68zm7.488-9.856q-1.409 0-2.304-1.024-.896-1.024-.896-2.432 0-1.472.96-2.56 1.023-1.088 2.432-1.088 1.407 0 2.304 1.024t.896 2.496q0 1.409-1.024 2.496-.96 1.088-2.368 1.088m12.635 28.48h4.48v4.032q2.432.96 5.888.96 3.52 0 5.312-1.088 1.856-1.152 1.856-2.816t-1.408-2.688q-1.344-1.088-6.528-3.84-5.12-2.752-7.168-4.608-2.048-1.92-2.048-4.992 0-3.968 3.072-6.144 3.136-2.24 8.512-2.24t10.176 2.624v7.616h-4.48v-4.288q-2.816-1.152-6.016-1.152-3.136 0-4.48 1.216-1.344 1.152-1.344 2.56t1.024 2.24q1.728 1.408 6.208 3.648 5.696 3.136 7.808 5.056t2.112 4.928q0 3.968-3.392 6.4-3.392 2.368-9.472 2.368-6.016 0-10.112-2.432zm55.837-8.96v3.392h-22.592q.32 4.673 2.752 7.68 2.432 2.944 6.528 2.944 2.688 0 4.8-.576 2.176-.576 3.008-1.024.833-.512 2.304-1.472l2.368 3.584q-4.864 4.288-12.16 4.288t-11.2-4.672q-3.84-4.736-3.84-11.968 0-7.231 3.84-11.904 3.905-4.736 10.56-4.736 6.72 0 10.176 4.032t3.456 10.432m-5.44-1.152q-.384-3.904-2.368-6.208-1.92-2.304-5.568-2.304-3.584 0-5.888 2.368-2.304 2.304-3.072 6.144zm37.116-28.672v44.16h5.248v2.688q-2.368 1.472-5.376 1.472t-4.16-.832q-1.089-.896-1.152-3.008-3.777 4.16-9.664 4.16-5.889 0-9.152-4.608-3.264-4.672-3.264-11.904 0-7.296 3.84-12.032t10.944-4.736q3.456 0 7.296 1.344v-12.544h-4.928v-4.16zm-22.08 31.808q0 5.249 2.112 8.64t5.888 3.392q3.84 0 6.208-3.008 2.432-3.008 2.432-7.232v-11.392a14 14 0 0 0-7.36-2.048q-3.904 0-6.592 3.2-2.688 3.137-2.688 8.448m95.245-15.808v4.16h-3.648l-7.424 27.84h-5.632l-6.4-23.936-6.4 23.936h-5.632l-7.488-27.84h-3.584v-4.16h13.568v4.16h-4.48l5.12 21.312 6.08-25.472h5.632l6.08 25.472 5.056-21.312h-4.416v-4.16zm3.886 4.16v-4.16h10.368v27.84h5.568v4.16h-16v-4.16h4.992v-23.68zm7.488-9.856q-1.409 0-2.304-1.024-.896-1.024-.896-2.432 0-1.472.96-2.56 1.024-1.088 2.432-1.088 1.409 0 2.304 1.024.896 1.025.896 2.496 0 1.409-1.024 2.496-.96 1.088-2.368 1.088m11.356 9.856v-3.52l4.928-.64h.64q2.047-4.8 2.752-8.448h2.688v8.448h9.536v4.16h-9.536v19.648q0 2.176.704 3.136.768.96 2.56.96 1.791 0 4.8-1.216l2.112 3.648q-3.648 2.304-7.808 2.304t-6.016-2.176q-1.792-2.176-1.792-5.632v-20.672zm34.118 23.68h5.568v4.16h-15.936v-4.16h4.928v-39.68h-4.928v-4.16h10.368v19.136q6.591-3.776 11.968-3.776 5.375 0 7.424 3.264 2.112 3.264 2.112 9.024v16.512h5.248v2.688q-2.369 1.472-5.505 1.472-3.071 0-4.159-1.024-1.024-1.088-1.024-3.456v-16.192q0-3.713-.96-5.568-.96-1.92-4.416-1.92t-10.688 3.84zM599.224 145.168h1.712v1.2h-1.712v8.4q0 1.936-.928 3.04-.928 1.12-2.736 1.12v-1.12q1.104 0 1.696-.8.608-.8.608-2.24V146.4q-1.968.128-2.784.656-.8.528-.8 1.536 0 .48.208.8.208.304.608.304.752 0 .752-1.264h1.28q0 1.04-.48 1.76-.48.704-1.552.704t-1.584-.672-.512-1.632q0-1.567 1.488-2.496 1.488-.928 4.736-.928m4.921 11.36q-1.104 0-1.728-.624-.624-.64-.624-1.696 0-1.072.832-1.792.831-.72 2.464-.72h1.744v-.816q0-1.472-1.409-1.472-1.183 0-2.175.288v1.072h-1.12v-1.904a8 8 0 0 1 1.696-.48q.991-.176 1.648-.176 1.28 0 2 .736.72.72.72 1.936v4.528h1.312v.672a2.53 2.53 0 0 1-1.36.368q-.768 0-1.04-.256-.273-.257-.272-.864-1.2 1.2-2.688 1.2m.144-1.2q1.375 0 2.544-1.552v-1.024h-1.76q-.976 0-1.456.384a1.21 1.21 0 0 0-.464.976q0 .576.288.896t.848.32m8.295 0h1.392v1.04h-3.984v-1.04h1.232v-5.92h-1.232v-1.04h2.288l.192.848q.544-.304.88-.464.336-.176.96-.352a4.3 4.3 0 0 1 1.232-.192q1.376 0 1.888.816.528.816.528 2.256v4.128h1.312v.672q-.592.368-1.376.368-.768 0-1.04-.256-.256-.272-.256-.864v-4.048q0-.929-.24-1.392-.24-.48-1.104-.48t-2.672.96zm14.422-3.504v.848h-5.648q.08 1.168.688 1.92.608.736 1.632.736.672 0 1.2-.144.543-.144.752-.256.207-.128.576-.368l.592.896q-1.216 1.072-3.04 1.072t-2.8-1.168q-.96-1.184-.96-2.992t.96-2.976q.975-1.184 2.64-1.184 1.68 0 2.544 1.008t.864 2.608m-1.36-.288q-.096-.976-.592-1.552-.48-.576-1.393-.576-.895 0-1.471.592-.576.576-.768 1.536zm19.896 2.592h1.2q0 1.231-.624 1.824-.624.592-1.584.592-.945 0-1.536-.432-.577-.432-1.168-1.52l-1.76-3.184-1.408.64v3.12h1.552v1.2h-2.912V146.4q-1.968.128-2.784.656-.8.528-.8 1.536 0 .48.208.8.207.304.608.304.752 0 .752-1.264h1.28q0 1.04-.48 1.76-.48.704-1.552.704t-1.584-.672q-.513-.672-.512-1.632 0-1.504 1.344-2.464t4.224-.96h2.048v1.2h-1.392v4.304l1.184-.544 3.088-3.76h-.768v-1.2h3.632v1.2h-1.2l-3.504 4.128 2 3.632q.4.656.688.944.303.272.72.272a.96.96 0 0 0 .72-.32q.32-.336.32-.896m-9.792 2.24v-1.2h1.552v1.2zm11.625-6.96v-1.04h2.592v6.96h1.392v1.04h-4v-1.04h1.248v-5.92zm1.872-2.464a.73.73 0 0 1-.576-.256.9.9 0 0 1-.224-.608q0-.368.24-.64a.8.8 0 0 1 .608-.272q.351 0 .576.256a.92.92 0 0 1 .224.624.89.89 0 0 1-.256.624.76.76 0 0 1-.592.272m2.855-1.536v-1.04h2.592v10.96h1.392v1.04h-4v-1.04h1.248v-9.92zm4.718 0v-1.04h2.592v10.96h1.392v1.04h-4v-1.04h1.248v-9.92zm5.039 4v-1.04h2.592v6.96h1.392v1.04h-4v-1.04h1.248v-5.92zm1.872-2.464a.73.73 0 0 1-.576-.256.9.9 0 0 1-.224-.608q0-.368.24-.64a.8.8 0 0 1 .608-.272q.352 0 .576.256a.92.92 0 0 1 .224.624.88.88 0 0 1-.256.624.76.76 0 0 1-.592.272m4.087 8.416q-1.008-1.184-1.008-2.992t1.008-2.976q1.008-1.184 2.832-1.184t2.832 1.184q1.008 1.168 1.008 2.976t-1.008 2.992q-1.008 1.168-2.832 1.168t-2.832-1.168m1.008-5.12q-.656.832-.656 2.128t.656 2.128q.655.832 1.824.832 1.168 0 1.824-.832t.656-2.128-.656-2.128-1.824-.832-1.824.832m9.133 5.088h1.392v1.04h-3.984v-1.04h1.232v-5.92h-1.232v-1.04h2.288l.192.848q.544-.304.88-.464.336-.176.96-.352a4.3 4.3 0 0 1 1.232-.192q1.376 0 1.888.816.528.816.528 2.256v4.128h1.312v.672q-.592.368-1.376.368-.768 0-1.04-.256-.256-.272-.256-.864v-4.048q0-.929-.24-1.392-.24-.48-1.104-.48t-2.672.96zm8.438-8.496q-.432-.08-.624-.368a1.17 1.17 0 0 1-.176-.624q0-.336.271-.576a.95.95 0 0 1 .673-.256q.399 0 .672.272.288.272.288.848 0 .56-.384 1.472t-.944 1.52l-.512-.32a3.5 3.5 0 0 0 .512-.944q.224-.576.224-1.024m3.056 7.232h1.12v1.008q.608.24 1.472.24.88 0 1.328-.272.464-.288.464-.704a.8.8 0 0 0-.352-.672q-.336-.272-1.632-.96-1.28-.688-1.792-1.152-.512-.48-.512-1.248 0-.992.768-1.536.784-.56 2.128-.56a5.2 5.2 0 0 1 2.544.656v1.904h-1.12v-1.072a3.9 3.9 0 0 0-1.504-.288q-.784 0-1.12.304-.336.288-.336.64t.255.56q.433.352 1.553.912 1.424.784 1.952 1.264t.528 1.232q0 .992-.848 1.6-.849.592-2.368.592-1.505 0-2.528-.608zM101.542 276.268h14.976v9.6H78.246v-9.6h12.416v-71.296q-15.615 1.152-22.144 5.504T61.99 222.38q0 3.84 1.664 6.4 1.664 2.432 4.864 2.432 6.016 0 6.016-10.112h10.24q0 8.32-3.84 14.08-3.84 5.632-12.416 5.632-8.575 0-12.672-5.376-4.095-5.376-4.096-13.056 0-12.545 11.904-19.968 11.904-7.424 36.352-7.424t35.584 8.192q11.136 8.064 11.136 21.504 0 13.312-8.192 20.864-8.064 7.424-20.48 7.424-9.6 0-16.512-2.944zm0-71.68v35.968q6.016 2.816 16.512 2.816 7.296 0 12.544-5.12 5.248-5.248 5.248-13.312 0-9.856-7.936-15.104t-26.368-5.248m93.996 25.6v-8.32h20.736v56.32h10.496v5.376q-4.736 2.944-12.672 2.944-7.808 0-8.576-6.784-13.44 7.552-24.192 7.552-10.624 0-14.848-6.528-4.096-6.528-4.096-18.048v-32.512h-9.856v-8.32h20.736V262.7q0 7.424 1.92 11.264 1.92 3.712 8.832 3.712t21.376-7.68v-39.808zm35.022 0v-8.32h18.304l1.792 7.808q7.68-9.088 19.712-9.088t18.56 9.344q6.528 9.216 6.528 23.808 0 14.464-7.68 23.936t-21.888 9.472q-6.656 0-14.592-2.56v20.48h9.856v8.32H230.56v-8.32h9.856v-74.88zm54.016 24.192q0-10.624-4.224-17.408t-11.904-6.784q-7.552 0-12.416 6.016-4.736 6.016-4.736 14.464v22.912q6.912 3.968 13.696 3.968 8.832 0 14.208-6.272 5.376-6.4 5.376-16.896m17.859-24.192v-8.32h18.304l1.792 7.808q7.68-9.088 19.712-9.088t18.56 9.344q6.528 9.216 6.528 23.808 0 14.464-7.68 23.936t-21.888 9.472q-6.656 0-14.592-2.56v20.48h9.856v8.32h-30.592v-8.32h9.856v-74.88zm54.016 24.192q0-10.624-4.224-17.408t-11.904-6.784q-7.552 0-12.416 6.016-4.736 6.016-4.736 14.464v22.912q6.912 3.968 13.696 3.968 8.832 0 14.208-6.272 5.376-6.4 5.376-16.896m16.579-24.192v-8.32h24.192v8.32h-4.608l14.336 43.392 13.44-43.392h-5.888v-8.32h23.04v8.32h-6.016l-18.56 55.68q-4.865 14.208-10.752 21.504-5.888 7.424-16.384 7.424-6.016 0-12.8-2.304l3.072-8.96q5.248 1.536 8.96 1.536 11.009 0 16.896-17.408l-20.992-57.472zm179.966-11.52q0 7.68-4.096 13.056t-12.672 5.376-12.416-5.632q-3.84-5.76-3.84-14.08h10.24q0 10.112 6.016 10.112 3.2 0 4.864-2.432 1.664-2.56 1.664-6.4 0-6.144-5.632-9.728-5.632-3.712-13.184-3.712-13.312 0-21.376 10.24-8.064 10.112-8.064 25.6 0 15.487 8.064 25.728 8.064 10.112 21.248 10.112 13.313 0 23.808-11.008l7.808 6.4q-11.392 14.848-30.976 14.848t-30.592-12.672q-10.88-12.8-10.88-33.152t11.008-33.28q11.008-13.056 29.952-13.056 11.648 0 20.352 6.656 8.704 6.528 8.704 17.024m48.542 11.52v-8.32h20.736v56.32h10.496v5.376q-4.736 2.944-12.672 2.944-7.808 0-8.576-6.784-13.44 7.552-24.192 7.552-10.624 0-14.848-6.528-4.096-6.528-4.096-18.048v-32.512h-9.856v-8.32h20.736V262.7q0 7.424 1.92 11.264 1.92 3.712 8.832 3.712t21.376-7.68v-39.808zm35.15-32v-8.32h20.736v87.68h11.136v8.32h-32v-8.32h9.984v-79.36zm37.622 32v-7.04l9.856-1.28h1.28q4.096-9.6 5.504-16.896h5.376v16.896h19.072v8.32h-19.072v39.296q0 4.352 1.408 6.272 1.536 1.92 5.12 1.92t9.6-2.432l4.224 7.296q-7.296 4.608-15.616 4.608t-12.032-4.352q-3.584-4.352-3.584-11.264v-41.344zm89.228 0v-8.32h20.736v56.32h10.496v5.376q-4.736 2.944-12.672 2.944-7.808 0-8.576-6.784-13.44 7.552-24.192 7.552-10.624 0-14.848-6.528-4.096-6.528-4.096-18.048v-32.512h-9.856v-8.32h20.736V262.7q0 7.424 1.92 11.264 1.92 3.712 8.832 3.712t21.376-7.68v-39.808zm55.758 47.36h11.136v8.32H798.56v-8.32h9.856v-47.36h-9.856v-8.32h18.304l1.536 6.784q4.352-2.432 7.04-3.712 2.688-1.408 7.68-2.816 5.12-1.536 9.856-1.536l7.168 1.92-2.944 10.496-5.76-1.536q-10.752 0-22.144 5.376zm91.123-28.032v6.784h-45.184q.64 9.344 5.504 15.36 4.865 5.888 13.056 5.888 5.376 0 9.6-1.152 4.352-1.152 6.016-2.048a226 226 0 0 0 4.608-2.944l4.736 7.168q-9.728 8.576-24.32 8.576t-22.4-9.344q-7.68-9.472-7.68-23.936t7.68-23.808q7.808-9.472 21.12-9.472 13.44 0 20.352 8.064t6.912 20.864m-10.88-2.304q-.768-7.808-4.736-12.416-3.84-4.608-11.136-4.608-7.168 0-11.776 4.736-4.608 4.608-6.144 12.288z"
    />
      <g
      transform="translate(920 260)"
    >
    <circle
      cx={105}
      cy={77.638}
      r={17.358}
      fill="none"
      style={{
        paintOrder: "markers stroke fill",
        fill: "#46403a",
        fillOpacity: 1,
        stroke: "none",
      }}
      transform="translate(-86.32 -58.958)"
    />
    <text
      xmlSpace="preserve"
      style={{
        fontStyle: "normal",
        fontWeight: 400,
        fontSize: 40,
        lineHeight: 1.25,
        fill: "#f4f2f1",
        fillOpacity: 1,
        stroke: "none",
      }}
      transform="matrix(.73176 0 0 .73176 -7.564 -13.06)"
    >
      <tspan x={26} y={57}>
        {"?"}
      </tspan>
    </text>
      </g>
  </svg>
);
export default SvgPuppyCultureCert;