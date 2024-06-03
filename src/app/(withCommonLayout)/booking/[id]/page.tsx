"use client";
import {
  Box,
  Button,
  Container,
  Stack,
  Typography,
  Grid,
  styled,
} from "@mui/material";
import { FieldValues } from "react-hook-form";
import { toast } from "sonner";
import PHForm from "@/components/Forms/PHForm";
import PHInput from "@/components/Forms/PHInput";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState, useEffect } from "react";
import Image from "next/image";
import {
  useGetSingleUserQuery,
  useGetUserWithProfileQuery,
} from "@/redux/api/userApi";
import { TUserWithProfile } from "@/types/User";
import { TFlat } from "@/types/Flats";
import { useGetFlatByIdQuery } from "@/redux/api/flatApi";
import { useBookingRequestMutation } from "@/redux/api/bookingApi";
import { bookingRequestActions } from "@/services/actions/text";
import { useRouter } from "next/navigation";

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
        toast.success("Flat deleted successfully!");
        router.push("/flats");
      }
    } catch (err: any) {
      console.error(err);
      setError(err.message);
      toast.error("Something went wrong!");
    }
  };

  if (isLoading || flatLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          background: "#FFF8F4",
          color: "#ff793f",
        }}
      >
        Loading...
      </Box>
    );
  }

  return (
    <Box sx={{ background: "#FFF8F4" }}>
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
