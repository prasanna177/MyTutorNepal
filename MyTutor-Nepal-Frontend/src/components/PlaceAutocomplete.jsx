import {
  Box,
  Input,
  Spinner,
  Text,
  VStack,
  Flex,
  HStack,
} from "@chakra-ui/react";
import axios from "axios";
import PlacesAutocomplete from "react-places-autocomplete";
import NormalButton from "./common/Button";
import { geocodeByAddress, getLatLng } from "react-places-autocomplete";

const PlaceAutocomplete = ({ address, setAddress, setCoordinates, width, isBecomeTutor }) => {
  const getUserCurrentAddress = async (lat, lng) => {
    let query = `${lat},${lng}`;
    let apiUrl = `${import.meta.env.VITE_API_ENDPOINT}?key=${
      import.meta.env.VITE_API_KEY
    }&q=${query}&pretty=1`;
    try {
      const res = await axios.get(apiUrl);
      return res.data.results[0].formatted;
    } catch (error) {
      console.log(error);
    }
  };

  const handleSelect = async (value) => {
    const results = await geocodeByAddress(value);
    const ll = await getLatLng(results[0]);
    setAddress(value);
    setCoordinates(ll);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          const cords = {
            lat: latitude,
            lng: longitude,
          };
          const currentAddress = await getUserCurrentAddress(
            latitude,
            longitude
          );
          setAddress(currentAddress);
          setCoordinates(cords);
        },
        (error) => {
          console.log(error);
        }
      );
    }
  };

  return (
    <HStack gap={1}>
      <Box flex={isBecomeTutor && 1}>
        <PlacesAutocomplete
          value={address}
          onChange={setAddress}
          onSelect={handleSelect}
        >
          {({
            getInputProps,
            suggestions,
            getSuggestionItemProps,
            loading,
          }) => (
            <Box pos={"relative"}>
              <VStack alignItems={"start"} w={"100%"}>
                <Input
                  width={width}
                  {...getInputProps({
                    placeholder: "Search Places ...",
                  })}
                />
                <Box
                  w={"100%"}
                  pos={"absolute"}
                  bgColor={"white"}
                  zIndex={1}
                  top={"100%"}
                >
                  {loading && <Spinner size={"md"} />}
                  {suggestions.map((suggestion, index) => {
                    return (
                      <Flex
                        _hover={{
                          cursor: "pointer",
                          bgColor: "gray.100",
                        }}
                        w={"100%"}
                        minH={"60px"}
                        alignItems={"center"}
                        fontSize={"lg"}
                        borderBottom={"1px"}
                        key={index}
                        {...getSuggestionItemProps(suggestion, {})}
                      >
                        <HStack>
                          <i className="fa-solid fa-location-dot"></i>
                          <Text>{suggestion.description}</Text>
                        </HStack>
                      </Flex>
                    );
                  })}
                </Box>
              </VStack>
            </Box>
          )}
        </PlacesAutocomplete>
      </Box>
      <NormalButton
        bgColor={"primary.100"}
        color={"primary.0"}
        onClick={getCurrentLocation}
        type="button"
        text={"Add location"}
      >
        Add location
      </NormalButton>
    </HStack>
  );
};

export default PlaceAutocomplete;
