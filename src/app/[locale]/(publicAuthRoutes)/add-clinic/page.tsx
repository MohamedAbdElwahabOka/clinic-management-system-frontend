"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useRouter } from "@/i18n/navigation";

// Import Leaflet CSS
import "leaflet/dist/leaflet.css";

// Add a local translate function for demo (replace with your real translation util if needed)
const translate = (key: string, fallback: string, vars?: Record<string, string>) => {
  if (vars && vars.field) {
    return fallback.replace('{field}', vars.field);
  }
  return fallback;
};

const clinicSchema = z.object({
  name: z.string().min(2, translate('requiredField', '{field} is required.', { field: 'Clinic Name' })),
  address: z.string().min(5, translate('requiredField', '{field} is required.', { field: 'Address' })),
  location: z.string().min(1, translate('requiredField', '{field} is required.', { field: 'Location' })),
  openHours: z.string().min(1, translate('requiredField', '{field} is required.', { field: 'Open Hours' })),
  openingDays: z.array(z.string()).min(1, translate('requiredField', '{field} is required.', { field: 'Opening Days' })),
});

type ClinicFormValues = z.infer<typeof clinicSchema>;

const DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

// Interactive Map Component using direct Leaflet integration
function InteractiveMap({ 
  location, 
  userLocation, 
  onLocationSelect 
}: { 
  location: string;
  userLocation: {lat: number, lng: number} | null;
  onLocationSelect: (lat: number, lng: number) => void;
}) {
  const mapRef = React.useRef<HTMLDivElement>(null);
  const mapInstanceRef = React.useRef<L.Map | null>(null);
  const markerRef = React.useRef<L.Marker | null>(null);

  React.useEffect(() => {
    if (!mapRef.current || !userLocation) return;

    // Import Leaflet dynamically to avoid SSR issues
    import('leaflet').then((L) => {
      if (!mapRef.current) return;

      // Clear any existing map
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      // Create map with unique container
      const map = L.map(mapRef.current, {
        center: [userLocation.lat, userLocation.lng],
        zoom: 15,
        scrollWheelZoom: true,
        zoomControl: true,
        attributionControl: true
      });

      // Add tile layer
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);

      // Add click handler
      map.on('click', (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        onLocationSelect(lat, lng);
      });

      mapInstanceRef.current = map;

      // Set marker if location exists
      if (location && location.includes(',')) {
        const [lat, lng] = location.split(',').map(Number);
        
        // Custom marker icon to avoid default icon issues
        const customIcon = L.divIcon({
          html: '<div style="background-color: #ef4444; width: 20px; height: 20px; border-radius: 50%; border: 3px solid white; box-shadow: 0 2px 4px rgba(0,0,0,0.3);"></div>',
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });

        markerRef.current = L.marker([lat, lng], { icon: customIcon }).addTo(map);
      }
    });

    // Cleanup on unmount
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [userLocation, location, onLocationSelect]);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-64 rounded-lg border-2 border-gray-300 z-0"
      style={{ minHeight: '256px' }}
    />
  );
}

export default function AddClinicPage() {
  const [userLocation, setUserLocation] = React.useState<{lat: number, lng: number} | null>(null);
  const [locationError, setLocationError] = React.useState<string>("");
  
  const form = useForm<ClinicFormValues>({
    resolver: zodResolver(clinicSchema),
    defaultValues: {
      name: "",
      address: "",
      location: "",
      openHours: "",
      openingDays: [],
    },
  });
  
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => { setMounted(true); }, []);
  const router = useRouter();

  // Get user's current location
  React.useEffect(() => {
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ lat: latitude, lng: longitude });
          // Set default location to user's current location
          if (!form.getValues('location')) {
            form.setValue('location', `${latitude.toFixed(6)},${longitude.toFixed(6)}`);
          }
        },
        (error) => {
          console.error('Error getting location:', error);
          setLocationError('Unable to get your location. Using default location.');
          // Fallback to Cairo coordinates
          setUserLocation({ lat: 30.0444, lng: 31.2357 });
          if (!form.getValues('location')) {
            form.setValue('location', '30.044400,31.235700');
          }
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 60000
        }
      );
    }
  }, [form]);

  function onSubmit(data: ClinicFormValues) {
    // TODO: Send data to backend
    alert("Clinic added! " + JSON.stringify(data, null, 2));
    router.push("/login");
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Add Your Clinic</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Clinic Name</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="address"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Address</FormLabel>
                <FormControl><Input {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="location"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Clinic Location</FormLabel>
                {locationError && (
                  <p className="text-sm text-orange-600 mb-2">{locationError}</p>
                )}
                <div className="mb-4">
                  {typeof window !== 'undefined' && mounted && (
                    <div className="relative">
                      {/* Real Interactive Leaflet Map */}
                      {userLocation ? (
                        <>
                          <InteractiveMap
                            location={field.value}
                            userLocation={userLocation}
                            onLocationSelect={(lat, lng) => {
                              field.onChange(`${lat.toFixed(6)},${lng.toFixed(6)}`);
                            }}
                          />
                       
                        </>
                      ) : (
                        <div className="w-full h-64 bg-gray-100 flex items-center justify-center rounded-lg border-2 border-gray-300">
                          <div className="text-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                            <p className="text-gray-600">Getting your location...</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Location Actions */}
                      <div className="flex gap-2 mt-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (userLocation) {
                              field.onChange(`${userLocation.lat.toFixed(6)},${userLocation.lng.toFixed(6)}`);
                            }
                          }}
                        >
                          📍 Use My Location
                        </Button>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            // Get fresh location
                            if (navigator.geolocation) {
                              navigator.geolocation.getCurrentPosition(
                                (position) => {
                                  const { latitude, longitude } = position.coords;
                                  setUserLocation({ lat: latitude, lng: longitude });
                                  field.onChange(`${latitude.toFixed(6)},${longitude.toFixed(6)}`);
                                },
                                () => {
                                  setLocationError('Unable to get your current location.');
                                }
                              );
                            }
                          }}
                        >
                          🔄 Refresh Location
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
                <FormControl>
                  <Input
                    placeholder="[Lat,Lng or click on map]"
                    {...field}
                    onChange={e => field.onChange(e.target.value)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="openHours"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Open Hours</FormLabel>
                <FormControl><Input placeholder="e.g. 09:00 - 17:00" {...field} /></FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="openingDays"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Opening Days</FormLabel>
                <div className="flex flex-wrap gap-2">
                  {DAYS.map(day => (
                    <label key={day} className="flex items-center gap-1">
                      <input
                        type="checkbox"
                        value={day}
                        checked={field.value.includes(day)}
                        onChange={e => {
                          if (e.target.checked) {
                            field.onChange([...field.value, day]);
                          } else {
                            field.onChange(field.value.filter((d: string) => d !== day));
                          }
                        }}
                      />
                      {day}
                    </label>
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">Add Clinic</Button>
        </form>
      </Form>
    </div>
  );
}
