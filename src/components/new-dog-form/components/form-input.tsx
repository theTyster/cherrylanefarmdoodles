//Static
import css from "@styles/new-dog-form.module.scss";

export default function FormInput({
  label,
  children,
}: {
  label: string | React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className={css["form-input"]}>
      <label>{label}</label>
      {children}
    </div>
  );
}
