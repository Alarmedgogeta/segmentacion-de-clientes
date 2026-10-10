if (!process.env.npm_config_user_agent?.startsWith("pnpm/")) {
  console.error(
    "Este repositorio utiliza exclusivamente pnpm. Ejecuta pnpm install.",
  );
  process.exit(1);
}
