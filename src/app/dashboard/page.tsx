import { ActivityCard } from "@/components/features/dashboard/components";
import { DashboardBarChart } from "@/components/features/dashboard/components/DashboardBarChart";
import { DashboardDoughnutChart } from "@/components/features/dashboard/components/DashboardDoughuntChart";
import { StatsCard } from "@/components/features/dashboard/components/StatsCard";
import {
  fetchStats,
  fetcRecentActivities,
} from "@/components/features/dashboard/services";
import { TaskCard } from "@/components/features/tasks/components";
import { Profile } from "@/components/ui/profile";
import { roles } from "@/utils/content/lists";
import { formatDate } from "@/utils/helpers";
import { Activity, Task, User } from "@/utils/types";

const page = async () => {
  const [activities, stats] = await Promise.all([
    fetcRecentActivities(),
    fetchStats(),
  ]);

  console.log(stats);

  return (
    <div className="w-full">
      <div className="flex flex-col gap-6">
        <div className="flex justify-start flex-col">
          <h3 className="text-28-700-s-black">Dashboard</h3>
          <p className="text-14-500-gray">Good morning Soufiane 👋🏻</p>
        </div>

        <div className="flex items-start gap-8 flex-wrap">
          <div className="flex flex-col grow gap-6 xl:w-[calc(100%-450px)]">
            <div className="flex flex-wrap items-stretch gap-3">
              {/* grid grid-cols-[repeat(auto-fill,minmax(330px,1fr))] */}
              <StatsCard
                title="Users"
                percentage={stats.users?.change}
                value={stats.users?.count}
                percentageStyles="bg-light-purple"
                headerStyles="before:bg-purple-main"
                arrow="arrow_purple"
              />

              <StatsCard
                title="States"
                percentage={stats.states?.change}
                value={stats.states?.count}
                percentageStyles="bg-[#ebfbff]"
                headerStyles="before:bg-[#6fc7c7]"
                arrow="arrow_green"
              />

              <StatsCard
                title="Tasks"
                percentage={stats.tasks?.change}
                value={stats.tasks?.count}
                percentageStyles="bg-blue-main/20"
                headerStyles="before:bg-blue-main"
                arrow="arrow_purple"
              />
            </div>

            <div className="flex flex-col gap-3">
              <h3 className="text-20-700-s-black">States Per Month</h3>
              <div className="flex flex-col gap-2">
                <div className="flex flex-wrap w-full gap-6 items-start">
                  <DashboardBarChart statsData={stats?.statesStats} />
                  <DashboardDoughnutChart
                    stateDistribution={stats.stateDistribution}
                  />
                </div>
              </div>
            </div>

            <div className="hidden flex-col gap-3 w-full xl:flex">
              <h3 className="text-20-700-s-black">Recent Tasks</h3>
              {stats.recentTasks?.map((task: Task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  viewMode="backlog"
                  editable={false}
                />
              ))}
            </div>
          </div>
          <div className="w-[400px] grow">
            <div className="w-full flex flex-col gap-8">
              <div className="w-full flex flex-col gap-4">
                <h3 className="text-20-700-s-black">Recent Activities</h3>
                <div className="flex flex-col gap-3 pl-6 relative before:absolute before:h-[calc(100%-20%)] before:left-0 before:border-l before:border-dashed before:border-gray-d9">
                  {activities.length !== 0 &&
                    activities.map(
                      (activity: Activity, index: number) =>
                        index < 3 && (
                          <ActivityCard key={activity.id} activity={activity} />
                        )
                    )}
                </div>
              </div>

              <div className="w-full flex flex-col gap-4">
                <h3 className="text-20-700-s-black">Utilisateurs</h3>
                <div className="flex flex-col gap-4">
                  {stats?.recentUsers.length !== 0 &&
                    stats?.recentUsers?.map(
                      (user: User, index: number) =>
                        index < 3 && (
                          <div
                            key={user.id}
                            className="flex justify-between items-center"
                          >
                            <div className="flex items-center gap-3">
                              <Profile
                                size={48}
                                name={user.name}
                                email={user.email}
                              />
                              <div className="flex flex-col gap-0.5">
                                <h5 className="text-12-500-s-gray">
                                  Ajouter le {formatDate(user.addedDate)}
                                </h5>
                                <p className="text-16-500-black">
                                  {user?.name}
                                </p>
                              </div>
                            </div>

                            <p className="text-12-500-s-gray py-1 px-2 bg-gray-very-light r-10">
                              {roles.find((r) => r.value === user?.role)?.name}
                            </p>
                          </div>
                        )
                    )}
                </div>
              </div>
            </div>
          </div>

          <div className="flex xl:hidden flex-col gap-3 w-full">
            <h3 className="text-20-700-s-black">Recent Tasks</h3>
            {stats.recentTasks?.map((task: Task) => (
              <TaskCard
                key={task.id}
                task={task}
                viewMode="backlog"
                editable={false}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
