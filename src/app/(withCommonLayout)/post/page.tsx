"use client";
import { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Container,
  Stack,
  Typography,
} from "@mui/material";
import PHForm from "@/components/Forms/PHForm";
import PHInput from "@/components/Forms/PHInput";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { uploadImageToImageBB } from "@/utils/uploadImageToImageBB";
import PHFileUploader from "@/components/Forms/PHFileUploader";
import { toast } from "sonner";
import { useCreateFlatMutation } from "@/redux/api/flatApi";
import { useRouter } from "next/navigation";

// Define the validation schema
const validationSchema = z.object({
  title: z.string().min(1, "Flat title is required"),
  image: z.string({ required_error: "Image file is required" }),
  squareFeet: z.string().min(1, "Square feet must be a positive number"),
  totalBedrooms: z.string().min(1, "Total bedrooms must be a positive number"),
  totalRooms: z.string().min(1, "Total rooms must be a positive number"),
  amenities: z.string().min(1, "Amenities description is required"),
  location: z.string().min(1, "Location is required"),
  description: z.string().min(1, "Description is required"),
  rent: z.string().min(1, "Rent must be a positive number"),
  advanceAmount: z.string().min(1, "Advance amount must be a positive number"),
});

const PostFlatPage = () => {
  const [thumbnailUrl, setThumbnailUrl] = useState<string>("");
  const [createFlat] = useCreateFlatMutation();
  const [imageUploadLoading, setImageUploadLoading] = useState<boolean>(false);
  const router = useRouter();

  const handleImageUpload = async (files: File[]) => {
    if (files.length > 0) {
      setImageUploadLoading(true);
      try {
        const url = await uploadImageToImageBB(files[0]);
        setThumbnailUrl(url);
        toast.success("Image uploaded successfully!");
      } catch (error) {
        console.error("Error uploading thumbnail image:", error);
        toast.error("Please upload image again");
      } finally {
        setImageUploadLoading(false);
      }
    }
  };

  const handlePost = async (values: any) => {
    try {
      if (thumbnailUrl) {
        const flatData = {
          ...values,
          squareFeet: Number(values.squareFeet),
          totalBedrooms: Number(values.totalBedrooms),
          totalRooms: Number(values.totalRooms),
          rent: Number(values.rent),
          advanceAmount: Number(values.advanceAmount),
          image: thumbnailUrl,
        };

        const res = await createFlat(flatData);

        if (res?.data?.id) {
          toast.success("Flat posted successfully!");
          setThumbnailUrl("");
          router.push("/flats");
        } else {
          toast.error("Something went wrong!");
        }
      } else {
        toast.error("Please upload image");
      }
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <Box sx={{ p: 3, background: "#FFF8F4" }}>
      <Container>
        <Stack
          sx={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Box
            sx={{
              maxWidth: 700,
              width: "100%",
              boxShadow: 1,
              borderRadius: 2,
              p: 8,
              textAlign: "center",
              background: "#fff",
            }}
          >
            <Stack
              sx={{
                justifyContent: "center",
                alignItems: "center",
              }}
              spacing={2}
            >
              <Typography
                variant="h3"
                fontWeight={600}
                style={{ color: "#0B1134CC", marginTop: "20px" }}
              >
                Share Your Flat
              </Typography>
              <Typography
                component="p"
                fontWeight={400}
                style={{ color: "#0B1134CC" }}
              >
                Please provide your flat information
              </Typography>
            </Stack>

            <Box m={5}>
              <PHForm
                onSubmit={handlePost}
                resolver={zodResolver(validationSchema)}
                defaultValues={{
                  title: "",
                  image: "",
                  squareFeet: "",
                  totalBedrooms: "",
                  totalRooms: "",
                  amenities: "",
                  location: "",
                  description: "",
                  rent: "",
                  advanceAmount: "",
                }}
              >
                <Stack spacing={4} my={1} marginBottom={5}>
                  <PHFileUploader
                    accept="image/*"
                    uploadType="single"
                    onFileUpload={handleImageUpload}
                  />
                  {imageUploadLoading && (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <Typography sx={{ color: "#ff793f", fontWeight: "500" }}>
                        Uploading image...
                      </Typography>
                    </Box>
                  )}
                  {thumbnailUrl && (
                    <Typography sx={{ color: "#ff793f", fontWeight: "500" }}>
                      Image uploaded successfully!
                    </Typography>
                  )}
                  <PHInput
                    name="title"
                    label="Flat Title"
                    type="text"
                    fullWidth={true}
                  />
                  <PHInput
                    name="squareFeet"
                    label="Square Feet"
                    type="number"
                    fullWidth={true}
                  />
                  <PHInput
                    name="totalBedrooms"
                    label="Total Bedrooms"
                    type="number"
                    fullWidth={true}
                  />
                  <PHInput
                    name="totalRooms"
                    label="Total Rooms"
                    type="number"
                    fullWidth={true}
                  />
                  <PHInput
                    name="amenities"
                    label="Amenities"
                    type="text"
                    fullWidth={true}
                  />
                  <PHInput
                    name="location"
                    label="Location"
                    type="text"
                    fullWidth={true}
                  />
                  <PHInput
                    name="description"
                    label="Description"
                    type="text"
                    fullWidth={true}
                  />
                  <PHInput
                    name="rent"
                    label="Rent"
                    type="number"
                    fullWidth={true}
                  />
                  <PHInput
                    name="advanceAmount"
                    label="Advance Amount"
                    type="number"
                    fullWidth={true}
                  />
                </Stack>

                <Button
                  sx={{
                    margin: "10px 0px",
                  }}
                  fullWidth={true}
                  type="submit"
                >
                  Submit
                </Button>
              </PHForm>
            </Box>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
};

export default PostFlatPage;
