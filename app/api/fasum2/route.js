export async function GET() {
  const data = [
    {
      id: 1,
      name: "DKI Jakarta",
      phone: "02112345678",
      address: {
        street: "Jl. Medan Merdeka Selatan No.8-9",
        city: "Jakarta",
        geo: {
          lat: "-6.175392",
          lng: "106.827153"
        }
      }
    },
    {
      id: 2,
      name: "Jawa Barat",
      phone: "022987654321",
      address: {
        street: "Jl. Diponegoro No.22",
        city: "Bandung",
        geo: {
          lat: "-6.914744",
          lng: "107.609810"
        }
      }
    },
    {
      id: 3,
      name: "Jawa Tengah",
      phone: "0242212334",
      address: {
        street: "Jl. Pahlawan No.9",
        city: "Semarang",
        geo: {
          lat: "-6.993410",
          lng: "110.420300"
        }
      }
    },
    {
      id: 4,
      name: "DI Yogyakarta",
      phone: "0274556677",
      address: {
        street: "Jl. Malioboro",
        city: "Yogyakarta",
        geo: {
          lat: "-7.795580",
          lng: "110.369490"
        }
      }
    },
    {
      id: 5,
      name: "Jawa Timur",
      phone: "031400200300",
      address: {
        street: "Jl. Pahlawan No.110",
        city: "Surabaya",
        geo: {
          lat: "-7.257472",
          lng: "112.752088"
        }
      }
    }
  ];

  return Response.json(data);
}
