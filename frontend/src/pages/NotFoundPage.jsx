import { Link } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Video } from 'lucide-react'

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] text-center px-4">
      <div className="mb-6 text-primary">
        <Video className="h-16 w-16 mx-auto opacity-50" />
      </div>
      <h1 className="text-7xl font-bold text-primary">404</h1>
      <h2 className="text-2xl font-semibold mt-4">Page Not Found</h2>
      <p className="text-muted-foreground mt-2 max-w-md">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Button asChild className="mt-8">
        <Link to="/">Return to Home</Link>
      </Button>
    </div>
  )
}

export default NotFoundPage
