resource "google_artifact_registry_repository" "pokemon_repo" {
  location      = var.gcp_region
  repository_id = "${var.app_name}-repo"
  description   = "Docker repo for Pokemon team defensive profile calcs"
  format        = "DOCKER"
}

resource "google_compute_network" "vpc_network" {
  name                    = "calculator-vpc"
  auto_create_subnetworks = false
  mtu                     = 1460
}

resource "google_compute_subnetwork" "subnet" {
  name          = "calculator-vpc-subnet"
  ip_cidr_range = "10.0.0.0/16"
  region        = "us-central1"
  network       = google_compute_network.vpc_network.id
  private_ip_google_access = true
}

resource "google_cloud_run_v2_service" "frontend" {
  name     = "${var.app_name}-frontend"
  location = var.gcp_region
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    scaling {
      max_instance_count = 1  
      min_instance_count = 0  
    }

    vpc_access {
      egress = "ALL_TRAFFIC"
      network_interfaces {
        network    = "calculator-vpc" 
        subnetwork = "calculator-vpc-subnet"      
      }
    }

    containers {
        image = "${var.gcp_region}-docker.pkg.dev/${var.gcp_project_id}/${google_artifact_registry_repository.pokemon_repo.repository_id}/${var.app_name}:latest"
        resources {
            limits = {
                cpu = "1"
                memory = "512Mi"
            }
        }
        ports {
            container_port = 8080
        }
    }
  }

    lifecycle {
        ignore_changes = [
        template[0].containers[0].image
        ]
    }
}

resource "google_cloud_run_v2_service_iam_member" "frontend_public_access" {
  name     = google_cloud_run_v2_service.frontend.name
  location = google_cloud_run_v2_service.frontend.location
  role     = "roles/run.invoker"
  member   = "allUsers" 
}


resource "google_cloud_run_v2_service" "backend" {
  name     = var.app_name
  location = var.gcp_region
  
  # RESTRICT INGRESS TO INTERNAL VPC ONLY
  ingress  = "INGRESS_TRAFFIC_INTERNAL_ONLY"

  template {
    scaling {
      max_instance_count = 1  
      min_instance_count = 0  
    }
    
    vpc_access {
      egress = "PRIVATE_RANGES_ONLY"
      network_interfaces {
        network    = "calculator-vpc"
        subnetwork = "calculator-vpc-subnet" 
      }
    }

    containers {
      image = "${var.gcp_region}-docker.pkg.dev/${var.gcp_project_id}/${google_artifact_registry_repository.pokemon_repo.repository_id}/backend:latest"
      resources {
        limits = {
          cpu    = "1"
          memory = "512Mi"
        }
      }
      ports {
        container_port = 8080
      }
    }
  }

  lifecycle {
    ignore_changes = [template[0].containers[0].image]
  }
}

output "api_endpoint" {
  value       = google_cloud_run_v2_service.backend.uri
  description = "The url for the api backend"
}