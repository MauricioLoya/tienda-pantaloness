import { handleSignOut } from '../actions/auth-actions';

export function SignOut() {
  return (
    <form action={handleSignOut}>
      <button
        type='submit'
        className='flex h-[48px] w-full grow items-center justify-center gap-2 rounded-md bg-gray-50 p-3 text-sm font-medium hover:bg-sky-100 hover:text-blue-600 md:flex-none md:justify-start md:p-2 md:px-3'
      >
        🏃‍♂️
        <div className='hidden md:block'>Sign Out</div>
      </button>
    </form>
  );
}
