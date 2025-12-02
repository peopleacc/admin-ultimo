"use client";

export default function TableUser() {
  return (
    <div className="glass-panel p-6">
      {/* Judul */}
      <div>
        <p className="text-sm uppercase tracking-[0.3em] text-[#2D336B]/60">
          Team
        </p>
        <h2 className="text-2xl font-semibold text-[#2D336B] mb-4">Users</h2>
      </div>

      {/* Filter & Search Bar */}
      <div className="my-4 flex sm:flex-row flex-col gap-3">
        <div className="flex flex-row gap-2">
          {/* Select jumlah data */}
          <div className="relative">
            <select className="h-full rounded-2xl border border-[#2D336B]/20 bg-white/80 text-[#2D336B] py-2 px-4 pr-8 leading-tight focus:outline-none focus:border-[#2D336B]">
              <option>5</option>
              <option>10</option>
              <option>20</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#2D336B]">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>

          {/* Select status */}
          <div className="relative">
            <select className="h-full rounded-2xl border border-[#2D336B]/20 bg-white/80 text-[#2D336B] py-2 px-4 pr-8 leading-tight focus:outline-none focus:border-[#2D336B]">
              <option>All</option>
              <option>Active</option>
              <option>Inactive</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#2D336B]">
              <svg
                className="fill-current h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
              >
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Input Search */}
        <div className="block relative flex-1">
          <span className="h-full absolute inset-y-0 left-0 flex items-center pl-2">
            <svg
              viewBox="0 0 24 24"
              className="h-4 w-4 fill-current text-[#2D336B]/60"
            >
              <path d="M10 4a6 6 0 100 12 6 6 0 000-12zm-8 6a8 8 0 1114.32 4.906l5.387 5.387a1 1 0 01-1.414 1.414l-5.387-5.387A8 8 0 012 10z" />
            </svg>
          </span>
          <input
            placeholder="Search"
            className="appearance-none rounded-2xl border border-[#2D336B]/20 block pl-8 pr-6 py-2 w-full bg-white/80 text-sm placeholder-[#2D336B]/50 text-[#2D336B] focus:bg-white focus:border-[#2D336B] focus:outline-none"
          />
        </div>
      </div>

      {/* Tabel */}
      <div className="-mx-4 sm:-mx-8 px-4 sm:px-8 py-4 overflow-x-auto">
        <div className="inline-block min-w-full rounded-2xl overflow-hidden border border-[#2D336B]/10 bg-white/80">
          <table className="min-w-full leading-normal">
            <thead>
              <tr>
                <th className="px-5 py-3 border-b-2 border-[#2D336B]/10 table-header-accent text-left text-xs font-semibold uppercase tracking-wider">
                  User
                </th>
                <th className="px-5 py-3 border-b-2 border-[#2D336B]/10 table-header-accent text-left text-xs font-semibold uppercase tracking-wider">
                  Role
                </th>
                <th className="px-5 py-3 border-b-2 border-[#2D336B]/10 table-header-accent text-left text-xs font-semibold uppercase tracking-wider">
                  Created At
                </th>
                <th className="px-5 py-3 border-b-2 border-[#2D336B]/10 table-header-accent text-left text-xs font-semibold uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="px-5 py-5 border-b border-[#2D336B]/5 bg-white/70 text-sm">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 w-10 h-10">
                      <img
                        className="w-full h-full rounded-full"
                        src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2.2&w=160&h=160&q=80"
                        alt="user"
                      />
                    </div>
                    <div className="ml-3">
                      <p className="text-[#2D336B] whitespace-nowrap font-semibold">
                        Vera Carpenter
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-5 border-b border-[#2D336B]/5 bg-white/70 text-sm">
                  <p className="text-[#2D336B] whitespace-nowrap">Admin</p>
                </td>
                <td className="px-5 py-5 border-b border-[#2D336B]/5 bg-white/70 text-sm">
                  <p className="text-[#2D336B] whitespace-nowrap">
                    Jan 21, 2020
                  </p>
                </td>
                <td className="px-5 py-5 border-b border-[#2D336B]/5 bg-white/70 text-sm">
                  <span className="relative inline-block px-3 py-1 font-semibold text-green-900 leading-tight">
                    <span
                      aria-hidden="true"
                      className="absolute inset-0 bg-green-200 opacity-70 rounded-full"
                    ></span>
                    <span className="relative">Active</span>
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
