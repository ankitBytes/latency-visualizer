export interface CloudRegion {
    id: string;
    provider: 'AWS' | 'GCP' | 'Azure';
    name: string;
    lat: number;
    lng: number;
}

export const cloudRegions: CloudRegion[] = [
    // AWS
    { id: 'aws-us-east-1', provider: 'AWS', name: 'US East (N. Virginia)', lat: 38.88, lng: -77.03 },
    { id: 'aws-us-west-1', provider: 'AWS', name: 'US West (N. California)', lat: 37.77, lng: -122.42 },
    { id: 'aws-us-west-2', provider: 'AWS', name: 'US West (Oregon)', lat: 45.52, lng: -122.68 },
    { id: 'aws-eu-west-1', provider: 'AWS', name: 'EU (Ireland)', lat: 53.34, lng: -6.26 },
    { id: 'aws-eu-central-1', provider: 'AWS', name: 'EU (Frankfurt)', lat: 50.11, lng: 8.68 },
    { id: 'aws-ap-northeast-1', provider: 'AWS', name: 'Asia Pacific (Tokyo)', lat: 35.68, lng: 139.69 },
    { id: 'aws-ap-southeast-1', provider: 'AWS', name: 'Asia Pacific (Singapore)', lat: 1.35, lng: 103.82 },
    { id: 'aws-sa-east-1', provider: 'AWS', name: 'South America (São Paulo)', lat: -23.55, lng: -46.63 },

    // GCP
    { id: 'gcp-us-central1', provider: 'GCP', name: 'US Central (Iowa)', lat: 41.87, lng: -93.60 },
    { id: 'gcp-europe-west1', provider: 'GCP', name: 'Europe West (Belgium)', lat: 50.45, lng: 3.82 },
    { id: 'gcp-asia-east1', provider: 'GCP', name: 'Asia East (Taiwan)', lat: 25.03, lng: 121.56 },

    // Azure
    { id: 'azure-eastus', provider: 'Azure', name: 'East US', lat: 37.37, lng: -79.85 },
    { id: 'azure-westeurope', provider: 'Azure', name: 'West Europe', lat: 52.36, lng: 4.90 },
    { id: 'azure-japaneast', provider: 'Azure', name: 'Japan East', lat: 35.68, lng: 139.69 },
];
