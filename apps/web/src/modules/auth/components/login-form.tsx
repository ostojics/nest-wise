import {useValidateLogin} from '@maya-vault/validation';

const LoginPage = () => {
  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useValidateLogin();

  return (
    <section>
      {/* eslint-disable-next-line no-console */}
      <form onSubmit={handleSubmit(() => console.log('submit'))}>
        <input {...register('email')} />
        {errors.email && <p>{errors.email.message}</p>}
        <input {...register('password')} />
        {errors.password && <p>{errors.password.message}</p>}
        <button type="submit">Login</button>
      </form>
    </section>
  );
};

export default LoginPage;
