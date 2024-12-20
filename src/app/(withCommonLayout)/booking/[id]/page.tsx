"use client";
import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
  Grid,
  styled,
  CardContent,
  Card,
} from "@mui/material";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { useGetUserWithProfileQuery } from "@/redux/api/userApi";
import { TUserWithProfile } from "@/types/User";
import { TFlat } from "@/types/Flats";
import { useGetFlatByIdQuery } from "@/redux/api/flatApi";
import { useBookingRequestMutation } from "@/redux/api/bookingApi";
import { useRouter } from "next/navigation";
import Loading from "@/components/UI/Loading/Loading";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SingleBedIcon from "@mui/icons-material/SingleBed";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import Image from "next/image";

const StyledInformationBox = styled(Box)(({ theme }) => ({
  background: "#fff",
  borderRadius: theme.spacing(1),
  width: "45%",
  padding: "8px 16px",
  "& p": {
    fontWeight: 500,
  },
}));

const BookingPage = ({ params }: { params: { id: string } }) => {
  const { data, isLoading } = useGetUserWithProfileQuery("");
  const [error, setError] = useState("");
  const [profileData, setProfileData] = useState<TUserWithProfile | undefined>(
    undefined
  );
  const [flat, setFlat] = useState<TFlat | undefined>(undefined);
  const [isButtonDisabled, setIsButtonDisabled] = useState<boolean>(false);
  const { data: flatData, isLoading: flatLoading } = useGetFlatByIdQuery(
    params?.id
  );
  const [bookingRequest] = useBookingRequestMutation();
  const router = useRouter();

  useEffect(() => {
    if (data) {
      setProfileData(data);
      setFlat(flatData);
    }
  }, [data, flatData]);

  const handleBooking = async () => {
    const data = { flatId: flatData?.id };
    setIsButtonDisabled(true);
    try {
      const res = await bookingRequest(data);
      if (res?.data?.id) {
        toast.success("Flat booked successfully!");
        router.push(`/checkout/${res?.data?.id}`);
      } else {
        toast.success("You have already booked this flat!");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message);
      toast.error("Something went wrong!");
    }
  };

  if (isLoading) {
    return <Loading />;
  }

  return (
    <Box sx={{ background: "#EBF0F4" }} mt={10}>
      <Container sx={{ paddingBottom: "50px" }}>
        <Stack
          sx={{
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <Typography
            variant="h4"
            component="h1"
            style={{ color: "#0B1134CC", marginTop: "20px" }}
          >
            Book Your Desired Flat
          </Typography>
          <Typography
            component="p"
            fontWeight={400}
            style={{ color: "#0B1134CC", marginTop: "5px" }}
          >
            Always we are with you!
          </Typography>
          <Box mt={5}>
            <Card
              sx={{
                borderRadius: "15px",
                boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
                display: "flex",
                flexDirection: { xs: "column", md: "row" },
                height: { xs: "auto", md: 250 },
              }}
            >
              <Grid container spacing={0}>
                {/* Image Grid */}
                <Grid item xs={12} md={6}>
                  <Box
                    sx={{
                      position: "relative",
                      height: { xs: 200, md: "100%" },
                      width: "100%",
                      overflow: "hidden",
                    }}
                  >
                    {flat && (
                      <Image
                        src={flat?.image}
                        alt="flat image"
                        width={500}
                        height={350}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                        }}
                      />
                    )}
                  </Box>
                </Grid>
                {/* Content Grid */}
                <Grid item xs={12} md={6}>
                  <CardContent
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      padding: { xs: 2, md: 3 },
                    }}
                  >
                    <Typography variant="h6" fontWeight={600}>
                      {flat?.title}
                    </Typography>
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      sx={{ color: "text.secondary", mt: 1 }}
                    >
                      <LocationOnIcon />
                      <Typography>{flat?.location}</Typography>
                    </Stack>

                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1}
                      sx={{ color: "text.secondary", mt: 1 }}
                    >
                      <SingleBedIcon />
                      <Typography>{flat?.totalBedrooms} Bedrooms</Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      alignItems="center"
                      sx={{ color: "text.secondary", mt: 1 }}
                    >
                      <SquareFootIcon />
                      <Typography>{flat?.squareFeet} sqft</Typography>
                    </Stack>
                    <Stack
                      direction="row"
                      alignItems="center"
                      sx={{ color: "text.secondary", mt: 1 }}
                    >
                      <AttachMoneyIcon sx={{ mr: 0.5 }} />
                      <Typography>{flat?.rent} USD</Typography>
                    </Stack>
                  </CardContent>
                </Grid>
              </Grid>
            </Card>
          </Box>
          <Grid item xs={12} md={8} my={4}>
            <Typography
              variant="h5"
              color={"secondary.main"}
              mb={2}
              marginLeft={5}
            >
              Your Information:
            </Typography>

            <Stack
              direction={{ xs: "column", md: "row" }}
              gap={2}
              flexWrap={"wrap"}
              alignItems="center"
              justifyContent="center"
            >
              <StyledInformationBox>
                <Typography color="secondary" variant="caption">
                  Username
                </Typography>
                <Typography>{profileData?.username}</Typography>
              </StyledInformationBox>
              <StyledInformationBox>
                <Typography color="secondary" variant="caption">
                  Email
                </Typography>
                <Typography> {profileData?.email}</Typography>
              </StyledInformationBox>
              <StyledInformationBox>
                <Typography color="secondary" variant="caption">
                  Name
                </Typography>
                <Typography>
                  {profileData?.name ? profileData?.name : "Data not provided"}
                </Typography>
              </StyledInformationBox>
              <StyledInformationBox>
                <Typography variant="caption" color="secondary">
                  Address
                </Typography>
                <Typography>
                  {profileData?.address
                    ? profileData?.address
                    : "Data not provided"}
                </Typography>
              </StyledInformationBox>
            </Stack>

            <Typography
              variant="h5"
              my={3}
              color={"secondary.main"}
              marginLeft={5}
            >
              Flat Information
            </Typography>
            <Stack
              direction={{ xs: "column", md: "row" }}
              flexWrap={"wrap"}
              gap={2}
              alignItems="center"
              justifyContent="center"
            >
              <StyledInformationBox>
                <Typography variant="caption" color="secondary">
                  Flat Title
                </Typography>
                <Typography>{flat?.title}</Typography>
              </StyledInformationBox>
              <StyledInformationBox>
                <Typography variant="caption" color="secondary">
                  Location
                </Typography>
                <Typography>{flat?.location}</Typography>
              </StyledInformationBox>
              <StyledInformationBox>
                <Typography variant="caption" color="secondary">
                  Number of Bedrooms
                </Typography>
                <Typography>{flat?.totalBedrooms}</Typography>
              </StyledInformationBox>
              <StyledInformationBox>
                <Typography variant="caption" color="secondary">
                  Total Rooms
                </Typography>
                <Typography>{flat?.totalRooms}</Typography>
              </StyledInformationBox>
              <StyledInformationBox>
                <Typography variant="caption" color="secondary">
                  Advance Amount{" "}
                </Typography>
                <Typography>{flat?.advanceAmount}</Typography>
              </StyledInformationBox>
              <StyledInformationBox>
                <Typography variant="caption" color="secondary">
                  Rent
                </Typography>
                <Typography>{flat?.rent}</Typography>
              </StyledInformationBox>
            </Stack>
          </Grid>

          <Button
            variant="contained"
            onClick={handleBooking}
            disabled={isButtonDisabled}
          >
            Book Flat
          </Button>
        </Stack>
      </Container>
    </Box>
  );
};

export default BookingPage;
