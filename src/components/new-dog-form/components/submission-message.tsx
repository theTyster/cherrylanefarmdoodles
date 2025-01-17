function SubmissionMsg({
  success,
  message,
}: {
  success: boolean;
  message?: string | null;
}): React.ReactNode {
  return message ? (
    <div>
      {success ? (
        <div>
          <hr />
          <h2 style={{ color: "green" }}>Success!</h2>
          {message.split("\n").map((msg, i) => (
            <p key={i + msg}>{msg}</p>
          ))}
          <hr />
        </div>
      ) : (
        <div>
          <hr style={{ backgroundColor: "red" }} />
          <h2 style={{ color: "red" }}>Failed!</h2>
          <h4 style={{ textAlign: "center" }}>
            Don&apos;t panic. Everything is probably ok. Probably.
          </h4>
          <p>{message}</p>
          <hr style={{ backgroundColor: "red" }} />
        </div>
      )}
    </div>
  ) : (
    <></>
  );
}

export default SubmissionMsg;
