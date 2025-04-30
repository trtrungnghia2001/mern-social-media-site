import { Button } from '@/components/ui/button'
import SigninForm from '@/features/authentication/components/SigninForm'
import SignupForm from '@/features/authentication/components/SignupForm'
import { useAuthStore } from '@/features/authentication/stores/auth.store'
import { FaGoogle } from 'react-icons/fa'
import { Link, useLocation } from 'react-router-dom'

const SigninSignupPage = () => {
  const { signinWithPassport } = useAuthStore()
  const location = useLocation()
  const isSignup = location.pathname.includes('signup')
  return (
    <div className="flex items-center justify-center py-10">
      <div className="bg-bgColorBox p-4 rounded-lg w-full max-w-md mx-auto">
        <h2 className="text-2xl font-bold text-center mb-4">
          {isSignup ? 'Register' : 'Log in'}
        </h2>
        {isSignup ? <SignupForm /> : <SigninForm />}
        {isSignup ? (
          <div className="text-center mt-4">
            Already have an account?{' '}
            <Link to={'/signin'} className="text-blue-500 font-medium">
              Signin
            </Link>
          </div>
        ) : (
          <div className="text-center mt-4">
            Don't have an account?{' '}
            <Link to={'/signup'} className="text-blue-500 font-medium">
              Signup
            </Link>
          </div>
        )}
        <div className="text-center mt-4 flex items-center gap-2">
          <hr className="flex-1" />
          <p>Or continue with</p>
          <hr className="flex-1" />
        </div>
        <div className="mt-4 ">
          <Button
            onClick={() => signinWithPassport('google')}
            className="w-full"
          >
            <FaGoogle />
            Google
          </Button>
        </div>
      </div>
    </div>
  )
}

export default SigninSignupPage
