import { axiosInstance } from '@/lib/axios'
import { requireAuth } from '@/utils/routeGuards'
import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useLoaderData } from '@tanstack/react-router'

const fetchUserProfile = async () => {
  const response = await axiosInstance.get('/user/profile')
  return response.data
}

export const Route = createFileRoute('/settings/')({
  beforeLoad: async () => {
    return await requireAuth();
  },
  component: RouteComponent,
})

function RouteComponent() {
  const {data:userData, isLoading} = useQuery({
    queryKey: ['userProfile'],
    queryFn: fetchUserProfile,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  })

  return (
    <div className="min-h-screen flex justify-center items-center">
      {/* Profile Picture */}
      <img src={userData?.avatar_url} alt="Profile Picture" className="w-32 h-32 rounded-full" />
    </div>
  )
}
