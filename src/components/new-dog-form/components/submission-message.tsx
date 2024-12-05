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
          <h2 style={{ color: "green" }}>Success!</h2>
          <p>{message}</p>
        </div>
      ) : (
        <div>
          <h2 style={{ color: "red" }}>Failed!</h2>
          <p>{message}</p>
        </div>
      )}
    </div>
  ) : (
    <></>
  );
}

export default SubmissionMsg;
