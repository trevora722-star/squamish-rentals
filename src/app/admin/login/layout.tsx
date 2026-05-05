/**
 * The login screen needs its own minimal layout — no admin nav, since the
 * user isn't signed in yet. This overrides the parent /admin layout.
 */
export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
