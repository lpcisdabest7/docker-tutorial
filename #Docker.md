# <span style="color: blue;">Docker tutorial</span>
**<span style="color: green;">Docker</span>** là một công cụ giúp đóng gói ứng dụng và các phụ thuộc của nó vào các "container" 

- **<span style="color: orange;">image</span>** :  Là một bản sao hệ thống có chứa các tệp, thư viện và cài đặt cần thiết cho ứng dụng.
- **<span style="color: orange;">Container</span>**: Là một instance (phiên bản chạy) của image. Nó như một "máy ảo" nhưng nhẹ hơn rất nhiều.
- **<span style="color: orange;">Dockerfile</span>**: Tệp cấu hình để tạo ra một image, nơi bạn mô tả các bước cần thiết để Docker thiết lập ứng dụng của bạn.
- **<span style="color: orange;">Docker Compose</span>**: Dùng để chạy và quản lý nhiều container cùng lúc.
- **<span style="color: orange;">Docker Network</span>**: Tạo mạng để các container có thể liên lạc với nhau.
- **<span style="color: orange;">Docker Volumes</span>**: Dùng để lưu trữ dữ liệu bên ngoài container, giúp dữ liệu không bị mất khi container bị xóa.


1. #### <span style="color: purple;">DOCKER COMPOSE</span> 
**Key commands**:
- **start** `compose.yaml` file
   <span style="color: brown;">docker compose up</span> ( <span style="color: brown;">-d</span> để chạy dịch vụ ở chế độ nền )
- **stop** và **remove** file
   <span style="color: brown;">docker compose down</span>
- **check logs** 
   <span style="color: brown;">docker compose logs ( <span style="color: brown;">-f</span> để auto check )</span> 
- **check container trong compose**
   <span style="color: brown;">docker compose ps</span>
***

1. #### <span style="color: purple;">DOCKER VOLUMES</span>

###### 1. <span style="color: blue;">Volumes (Managed Volumes)</span>: Docker tự quản lý.

```
services:
  my_service:
    image: my_image
    volumes:
      - my_data_volume:/data
volumes:
  my_data_volume:
```
**Ưu điểm**:
- <span style="color: green;">Volume không bị phụ thuộc vào cấu trúc thư mục của máy chủ.</span>
- <span style="color: green;">Dữ liệu được giữ lại khi container bị xóa.</span>

###### 2. <span style="color: blue;">Bind Mounts</span>: Mount thư mục cụ thể từ hệ thống file của host vào container.


```
services:
  my_service:
    image: my_image
    volumes:
      - /path/on/host:/path/in/container
```
**Ưu điểm**:
- <span style="color: green;">Linh hoạt vì bạn có thể chọn thư mục bất kỳ trên máy chủ.</span>
- <span style="color: green;">Thích hợp cho việc phát triển, vì bạn có thể sửa mã nguồn trực tiếp trên máy chủ và thấy thay đổi trong container.</span>

**Nhược điểm**:
- <span style="color: red;">Phụ thuộc vào đường dẫn của máy chủ, có thể gây khó khăn khi chuyển sang môi trường khác.</span>

###### 3. <span style="color: blue;">tmpfs Mounts</span>: Lưu trữ dữ liệu tạm thời trong bộ nhớ RAM, không lưu trữ trên ổ đĩa.
```
services:
  my_service:
    image: my_image
    tmpfs:
      - /path/in/container
```
**Ưu điểm**:
- <span style="color: green;">Truy cập rất nhanh do lưu trữ trong bộ nhớ.</span>
- <span style="color: green;">Bảo mật vì dữ liệu bị mất khi container dừng.</span>

**Nhược điểm**:
- <span style="color: red;">Giới hạn bởi dung lượng RAM của máy chủ.</span>

***

3. #### <span style="color: purple;">DOCKER NETWORKING</span>
 
###### 1. <span style="color: blue;">Bridge Network</span>
   - <span style="color: green;">Loại mạng mặc định khi không có mạng nào được chỉ định.</span>
   - <span style="color: green;">Được sử dụng khi bạn chỉ cần kết nối các container trên cùng một máy chủ Docker.</span>
   - <span style="color: green;">Tất cả các container trên bridge network có thể giao tiếp với nhau mà không cần phải mở cổng ra ngoài (với cổng `expose` hoặc `port`).</span>

```services:
  app:
    image: my_app_image
    networks:
      - my_bridge_network
  db:
    image: my_db_image
    networks:
      - my_bridge_network

networks:
  my_bridge_network:
    driver: bridge
```
`# Tạo mạng bridge`

`docker network create --driver bridge my_bridge_network`
`docker run -d --name <tên_container> --network my_bridge_network <tùy_chọn_khác> <tên_ảnh>
`
`examplle`: `docker run -d --name web_service --network my_bridge_network -p 8080:80 web_image
`
###### 2. <span style="color: blue;">Host Network</span>
   - <span style="color: green;">Container chia sẻ network namespace với máy chủ Docker.</span>
   - <span style="color: green;">Container dùng trực tiếp địa chỉ IP và các cổng của máy chủ.</span>
   - <span style="color: green;">Hữu ích cho các trường hợp cần truy cập nhanh và hiệu quả đến tài nguyên mạng của máy chủ.</span>

###### 3. <span style="color: blue;">Overlay Network</span>
   - <span style="color: green;">Kết nối các container trên nhiều máy chủ Docker, hoạt động với Docker Swarm hoặc Kubernetes.</span>
   - <span style="color: green;">Hữu ích cho các ứng dụng phân tán và microservices cần giao tiếp qua nhiều node.</span>
   - <span style="color: green;">Overlay network an toàn và hỗ trợ mã hóa dữ liệu giữa các container.</span>

`# Tạo mạng overlay`
`docker network create --driver overlay my_overlay_network`
`docker service create --name <tên_dịch_vụ> --network my_overlay_network <tùy_chọn_khác> <tên_ảnh> `
`example`: `docker service create --name database_service --network my_overlay_network -e MYSQL_ROOT_PASSWORD=secret -e MYSQL_DATABASE=sales_db mysql:latest
`
```
services:
  web:
    image: web_image
    networks:
      - my_overlay_network
  api:
    image: api_image
    networks:
      - my_overlay_network

networks:
  my_overlay_network:
    driver: overlay
```
###### 4. <span style="color: blue;">None Network</span>
   - <span style="color: green;">Container không có kết nối mạng nào.</span>
   - <span style="color: green;">Sử dụng trong các trường hợp không muốn container có bất kỳ kết nối mạng nào.</span>

###### 5. <span style="color: blue;">Macvlan Network</span>
   - <span style="color: green;">Container có địa chỉ MAC và IP riêng, hoạt động giống như một thiết bị vật lý trên mạng.</span>
   - <span style="color: green;">Phù hợp cho các ứng dụng cần địa chỉ mạng thực để kết nối với các hệ thống mạng cũ hoặc mạng LAN.</span>

#### So sánh giữa <span style="color: blue;">Bridge Network</span> và <span style="color: blue;">Overlay Network</span> trong Docker

| Đặc điểm              | <span style="color: blue;">Bridge Network</span>                             | <span style="color: blue;">Overlay Network</span>                              |
|-----------------------|--------------------------------------------|----------------------------------------------|
| **Mục đích**          | <span style="color: purple;">Kết nối các container trên cùng một máy chủ Docker</span> | <span style="color: green;">Kết nối các container trên nhiều máy chủ Docker (thường dùng trong Swarm hoặc Kubernetes)</span> |
| **Cấu hình mặc định** | <span style="color: purple;">Là loại mạng mặc định khi không cấu hình mạng nào khác</span> | <span style="color: green;">Cần được tạo thủ công và dùng với Docker Swarm hoặc Kubernetes</span> |
| **Phạm vi**           | <span style="color: purple;">Chỉ trong nội bộ máy chủ Docker</span>            | <span style="color: green;">Phân tán qua nhiều máy chủ trong một cụm Swarm hoặc Kubernetes</span> |
| **Khả năng bảo mật**  | <span style="color: purple;">Bảo mật nhưng giới hạn trong một máy chủ</span>   | <span style="color: green;">Bảo mật và hỗ trợ mã hóa dữ liệu giữa các container trên các máy chủ khác nhau</span> |
| **Hiệu suất**         | <span style="color: purple;">Cao do không cần mã hóa dữ liệu và giao tiếp trên cùng một máy chủ</span> | <span style="color: green;">Thấp hơn Bridge Network do cần mã hóa và quản lý giao tiếp qua mạng LAN/WAN</span> |
| **Trường hợp sử dụng**| <span style="color: purple;">Phù hợp với các ứng dụng đơn giản, cần giao tiếp giữa các container trên cùng một máy chủ</span> | <span style="color: green;">Phù hợp với các ứng dụng phân tán, microservices cần giao tiếp qua nhiều máy chủ</span> |
| **Tính linh hoạt**    | <span style="color: purple;">Ít linh hoạt hơn, chỉ giới hạn trên một máy chủ Docker</span> | <span style="color: green;">Rất linh hoạt, cho phép mở rộng hệ thống ra nhiều máy chủ và vùng địa lý khác nhau</span> |

### Kết luận

- **Bridge Network**: <span style="color: Brown;">Thích hợp cho các hệ thống chạy toàn bộ trên một máy chủ và không yêu cầu giao tiếp giữa các máy chủ khác nhau. Đơn giản, hiệu suất cao cho các ứng dụng nội bộ.</span>
- **Overlay Network**: <span style="color: Brown;">Phù hợp cho các ứng dụng phân tán trên nhiều máy chủ, đáp ứng các yêu cầu phức tạp của microservices, nhưng có thể giảm hiệu suất do yêu cầu mã hóa và quản lý kết nối.</span>


#### EXPOSE && PORT 

###### EXPOSE
- **`EXPOSE`** là một chỉ thị trong Dockerfile hoặc một tùy chọn khi chạy container, cho phép một cổng trong container sẵn sàng để chấp nhận kết nối từ các container khác (connect in network). 
- **Chú ý**: `EXPOSE` chỉ làm cho cổng đó có sẵn trong mạng nội bộ và không ánh xạ cổng đó ra bên ngoài máy chủ. Để truy cập từ bên ngoài, bạn cần sử dụng `-p`.
`docker run --expose <cổng_container> <tên_image>`
###### PORT
- **`-p` (Port Mapping)** là tùy chọn trong lệnh `docker run` cho phép ánh xạ một cổng trên máy chủ đến một cổng trong container, cho phép truy cập từ bên ngoài vào container (Maybe connect out network).
`docker run -p <cổng_máy_chủ>:<cổng_container> <tên_image>`



## <span style="color: purple;">3. Sự Khác Biệt Giữa EXPOSE và -p</span>

| **<span style="color: blue;">Tính Năng</span>**        | **<span style="color: blue;">EXPOSE</span>**                                       | **<span style="color: blue;">-p</span>**                                           |
|----------------------|--------------------------------------------------|--------------------------------------------------|
| **<span style="color: green;">Mục Đích</span>**         | <span style="color: purple;">Chỉ định cổng mà container sẽ sử dụng trong mạng nội bộ</span> | <span style="color: green;">Ánh xạ cổng từ máy chủ đến container</span>            |
| **<span style="color: green;">Kết Nối</span>**          | <span style="color: purple;">Chỉ cho phép các container khác trong cùng một network kết nối</span> | <span style="color: green;">Cho phép kết nối từ bên ngoài vào container</span>     |
| **<span style="color: green;">Cách Sử Dụng</span>**     | <span style="color: purple;">Sử dụng trong Dockerfile hoặc lệnh `run`</span>      | <span style="color: green;">Sử dụng trong lệnh `docker run`</span>                 |
| **<span style="color: green;">Ví Dụ</span>**            | <span style="color: purple;">`EXPOSE 3000`</span>                                    | <span style="color: green;">`-p 3000:3000`</span>              |

## Kết Luận

- **`EXPOSE`** được sử dụng để chỉ định cổng mà container sẽ lắng nghe, trong khi **`-p`** được sử dụng để ánh xạ cổng đó từ máy chủ đến container.
- Để một ứng dụng có thể truy cập từ bên ngoài, bạn cần sử dụng **`-p`**.

***

4. #### <span style="color: purple;">START CONTAINERS AUTOMATICALLY</span>
   
###### 1. <span style="color: blue;">Chính sách khởi động lại (Restart Policies)</span>

### Các tùy chọn khởi động lại container:

- **i. `no`**: <span style="color: green;">Container sẽ không tự khởi động lại dù nó bị dừng do lỗi hoặc khi Docker daemon hoặc hệ thống khởi động lại.</span>
   - <span style="color: blue;">**Mô tả**</span>: <span style="color: brown;">Docker không tự động khởi động lại container nếu container bị dừng, bất kể lý do là gì.</span>
   - <span style="color: purple;">**Ứng dụng**</span>: <span style="color: teal;">Sử dụng khi bạn không muốn container tự động khởi động lại hoặc muốn kiểm soát việc này hoàn toàn thủ công.</span>  
   - <span style="color: red;">**Example**</span>: `docker run -d --name redis_no_restart --restart no redis`

- **ii. `on-failure`**: <span style="color: green;">Container sẽ tự động khởi động lại nếu dừng do lỗi (thoát với mã khác 0).</span>
   - <span style="color: blue;">**Mô tả**</span>: <span style="color: brown;">Docker sẽ khởi động lại container khi nó bị dừng do lỗi (mã thoát khác 0).</span>
   - <span style="color: purple;">**Tùy chọn bổ sung**</span>: Bạn có thể đặt giới hạn số lần khởi động lại với `--restart on-failure:<max-retries>`. Ví dụ: `docker run -d --restart on-failure:5 redis`.
   - <span style="color: green;">**Ứng dụng**</span>: <span style="color: teal;">Phù hợp cho các container mà bạn chỉ muốn khởi động lại khi có lỗi xảy ra, giúp tránh tình trạng khởi động lại liên tục nếu container bị dừng do nguyên nhân khác.</span>  
   - <span style="color: red;">**Example**</span>: `docker run -d --name redis_on_failure --restart on-failure redis`


- **iii. `always`**: <span style="color: green;">Container sẽ luôn khởi động lại bất kể lý do dừng là gì, trừ khi bị dừng thủ công.</span>
   - <span style="color: blue;">**Mô tả**</span>: <span style="color: brown;">Container sẽ luôn khởi động lại nếu bị dừng, bất kể lý do.</span>
   - <span style="color: purple;">**Lưu ý**</span>: Nếu bạn dừng container thủ công bằng `docker stop`, container sẽ không tự khởi động lại ngay lập tức, nhưng nếu Docker daemon hoặc hệ thống khởi động lại, container sẽ khởi động lại.
   - <span style="color: green;">**Ứng dụng**</span>: <span style="color: teal;">Phù hợp cho các dịch vụ quan trọng cần đảm bảo luôn sẵn sàng hoạt động.</span>  
   - <span style="color: red;">**Example**</span>: `docker run -d --name redis_always_restart --restart always redis`

- **iv. `unless-stopped`**: <span style="color: green;">Container sẽ tự động khởi động lại khi Docker daemon hoặc hệ thống khởi động lại, trừ khi container đã được dừng thủ công trước đó.</span>
   - <span style="color: blue;">**Mô tả**</span>: <span style="color: brown;">Tương tự như `always`, nhưng sẽ không khởi động lại nếu container đã bị dừng thủ công trước đó.</span>
   - <span style="color: purple;">**Lưu ý**</span>: Nếu container bị dừng thủ công, Docker sẽ ghi nhớ trạng thái này và không tự khởi động lại container ngay cả khi Docker daemon hoặc hệ thống khởi động lại.
   - <span style="color: green;">**Ứng dụng**</span>: <span style="color: teal;">Hữu ích cho các dịch vụ mà bạn muốn tự động khởi động lại khi có sự cố hoặc khởi động lại hệ thống, nhưng không khởi động lại nếu đã bị dừng thủ công.</span>  
   - <span style="color: red;">**Example**</span>: `docker run -d --name redis_unless_stopped --restart unless-stopped redis`

  **<span style="color: purple;">Note</span>**
  
  - **Dừng thủ công**: <span style="color: purple;">Khi container được dừng bằng lệnh `docker stop`, các container với `--restart always` sẽ không khởi động lại ngay lập tức. Chúng sẽ chỉ khởi động lại nếu Docker daemon hoặc hệ thống được khởi động lại.</span>
  
  - **Giới hạn số lần khởi động lại**: <span style="color: purple;">Sử dụng `on-failure:<max-retries>` để tránh tình trạng container khởi động lại liên tục khi gặp lỗi.</span>
  
  - **Khởi động lại Docker daemon**: <span style="color: purple;">Các container có `--restart always` sẽ tự động khởi động lại khi Docker daemon khởi động lại, trong khi các container `--restart unless-stopped` chỉ khởi động lại nếu chưa bị dừng thủ công.</span>

 
*** 

# <span style="color: blue;">Run Multiple Processes in a Container</span>
###### <span style="color: purple;">Chạy nhiều tiến trình trong một container là một khái niệm trong Docker mà cho phép người dùng khởi động và quản lý nhiều tiến trình cùng một lúc bên trong một container. Dưới đây là một số điểm khái quát về lý thuyết này:</span>

## <span style="color: green;">1. Container là gì?</span>
- **Container** là đơn vị nhẹ, độc lập, chứa mã nguồn, thư viện và các phụ thuộc cần thiết để chạy một ứng dụng.
- Chia sẻ cùng một hệ điều hành nhưng có môi trường runtime riêng biệt.

## <span style="color: green;">2. Chạy nhiều tiến trình:</span>
- Có thể chạy nhiều tiến trình hoặc dịch vụ khác nhau trong một container.
- Ví dụ: một ứng dụng web, một cơ sở dữ liệu, và một tiến trình quản lý hàng đợi.

## <span style="color: green;">3. Lợi ích:</span>
- **Tiết kiệm tài nguyên:** Container nhẹ hơn máy ảo.
- **Đơn giản hóa quản lý:** Dễ dàng hơn trong một số trường hợp khi các tiến trình cần giao tiếp chặt chẽ.

## <span style="color: green;">4. Nhược điểm:</span>
- **Khó khăn trong quản lý:** Theo dõi và quản lý nhiều tiến trình có thể phức tạp.
- **Không tuân thủ nguyên tắc “một dịch vụ mỗi container”:** Mỗi container nên chỉ chạy một dịch vụ duy nhất để dễ quản lý và mở rộng.

## <span style="color: green;">5. Cách thực hiện:</span>
- **Sử dụng Supervisor hoặc S6:** Công cụ quản lý nhiều tiến trình trong một container.
- **Docker Compose:** Định nghĩa và chạy nhiều dịch vụ, quản lý dễ dàng hơn.

## <span style="color: green;">6. Khi nào nên sử dụng:</span>
- Có thể hữu ích trong một số tình huống, nhưng nên cân nhắc đến quy mô và nhu cầu của ứng dụng.
- Thường thì với các ứng dụng phức tạp, chạy từng dịch vụ trong các container riêng biệt sẽ được ưu tiên hơn.

***
# <span style="color: blue;">Resource constraints</span>
###### <span style="color: purple;">Resource constraints (giới hạn tài nguyên) trong Docker là cách để kiểm soát tài nguyên mà một container có thể sử dụng trên máy chủ. Điều này rất quan trọng khi bạn chạy nhiều container cùng một lúc hoặc cần tối ưu hóa hiệu suất để đảm bảo các ứng dụng không xâm phạm tài nguyên của nhau.</span>

1. CPU Constraints (Giới hạn CPU)

***
# <span style="color: blue;">Docker Service</span>

1. **CREATE**
   
  **Description** `Create a new service`
  **Usage** `docker service create [OPTIONS] IMAGE [COMMAND] [ARG...]`
```
--name <name>: Tên của service.
--replicas <number>: Số lượng bản sao (replica) của service cần chạy.
-p, --publish <host_port>:<container_port>: Map cổng của máy chủ (host) với cổng của container.
--env <key>=<value>: Thiết lập biến môi trường cho container trong service.
--network <network_name>: Đặt service vào một mạng Docker cụ thể.
--constraint <constraint>: Thiết lập ràng buộc, như chỉ chạy trên các node có nhãn nhất định.
--limit-cpu <value>: Giới hạn CPU cho container (ví dụ: 0.5 là 50%).
--limit-memory <value>: Giới hạn bộ nhớ (RAM) cho container (ví dụ: 512m).

Example: docker service create --name web_app --replicas 3 -p 8080:80 --env ENVIRONMENT=production nginx

```
2. **INSPECT**
   
  **Description** `Display detailed information on one or more services`
  **Usage** `docker service inspect [OPTIONS] SERVICE [SERVICE...]`
```
Kết quả trả về là thông tin chi tiết về cấu hình, trạng thái, các replica, và lịch sử cập nhật của service.

-f, --format <format>: Định dạng output bằng cách sử dụng Go template.
SERVICE: Tên hoặc ID của service cần xem thông tin.
{{json .Mounts}}     // {{range.NetworkSettings.Networks}}{{.IPAddress}}{{end}}
Example: docker service inspect -f '{{json .HostConfig}}' web_app 
```

3. **LOGS**
   
  **Description** `Fetch the logs of a service or task`
  **Usage** `docker service logs [OPTIONS] SERVICE|TASK`
```
-f, --follow: Theo dõi logs liên tục, cập nhật real-time.
--since <time>: Xem logs từ một thời điểm nhất định (ví dụ: 10m là 10 phút trước).
-t, --timestamps: Hiển thị thời gian logs.
SERVICE: Tên hoặc ID của service.

Example: docker service logs -f --since 5m web_app
```

3. **SCALE**

  **Description** `Scale one or multiple replicated services`
  **Usage** `docker service scale SERVICE=REPLICAS [SERVICE=REPLICAS...]`
 - Tính năng scale trong Docker Compose cho phép bạn chỉ định số lượng bản sao (instances) của một dịch vụ nhất định mà bạn muốn chạy.
```
version: '3.8'
services:
  redis:
    image: redis
    ports:
      - "6380-6382:6379"

Example: docker-compose up --scale redis=3 -d      
```

***
Other
- Xuất hệ thống tệp của một container sang một tệp tar.
`docker export CONTAINER_ID_OR_NAME > mycontainer.tar  `
- Chạy một lệnh bên trong container đang chạy.
`docker exec -it CONTAINER_ID_OR_NAME COMMAND`
-  cung cấp cho bạn số liệu thống kê về sử dụng tài nguyên của một hoặc nhiều containers đang chạy. 
`docker stats [OPTIONS] [CONTAINER...]  `



***
# <span style="color: blue;">MACVLAN</span>
1. Tạo một mạng macvlan trong Docker:

`docker network create -d macvlan \
  --subnet=192.168.1.0/24 \
  --gateway=192.168.1.1 \
  -o parent=eth0 (chọn cổng ensp trên máy ví dụ enp1s0.10) \
  my_macvlan_network`
```
-d macvlan: Chỉ định kiểu mạng là macvlan.
--subnet: Định nghĩa dải mạng cho macvlan.
--gateway: Gateway cho mạng.
-o parent=eth0: Chỉ định giao diện mạng vật lý sẽ được dùng để tạo macvlan.
my_macvlan_network: Tên của mạng macvlan được tạo.
```
2. Khởi chạy một container Docker với mạng macvlan:

`docker run -it --rm --network my_macvlan_network --name=my_container busybox:version  
`

```
--network my_macvlan_network: Chỉ định container sử dụng mạng macvlan đã tạo.
--name=my_container: Đặt tên cho container.
busybox: Ảnh container để khởi chạy.
```
`example : docker run -it --rm --network my_macvlan_network  --name test demodocker-app:latest `



*****
- **Kết luận:** File Docker Compose có nhiều tùy chọn khác nhau để cấu hình và quản lý các dịch vụ Docker. Các tùy chọn chính bao gồm `version`, `services`, `volumes`, `networks`, `build`, và `environment`.

- **Giải thích:**

  1. **Version:**
     - `version` xác định phiên bản của cú pháp Docker Compose mà bạn đang sử dụng. Phiên bản phổ biến nhất hiện nay là `3`.
     - Ví dụ: 
       ```yaml
       version: '3'
       ```

  2. **Services:**
     - `services` là phần quan trọng nhất trong file Compose, định nghĩa các container Docker mà bạn muốn chạy.
     - Ví dụ:
       ```yaml
       services:
         web:
           image: nginx
           ports:
             - "80:80"
         db:
           image: mysql
           environment:
             MYSQL_ROOT_PASSWORD: example
       ```

  3. **Build:**
     - Tùy chọn `build` cho phép bạn xây dựng image từ Dockerfile.
     - Ví dụ:
       ```yaml
       services:
         app:
           build:
             context: .
             dockerfile: Dockerfile
       ```

  4. **Volumes:**
     - `volumes` được sử dụng để ánh xạ dữ liệu từ host vào container hoặc giữa các container với nhau.
     - Ví dụ:
       ```yaml
       services:
         db:
           image: mysql
           volumes:
             - db_data:/var/lib/mysql
       volumes:
         db_data:
       ```

  5. **Networks:**
     - `networks` cho phép định nghĩa và cấu hình mạng cho các dịch vụ của bạn.
     - Ví dụ:
       ```yaml
       services:
         web:
           networks:
             - front-tier
         db:
           networks:
             - back-tier
       networks:
         front-tier:
         back-tier:
       ```

  6. **Environment:**
     - `environment` được sử dụng để thiết lập các biến môi trường cho container.
     - Ví dụ:
       ```yaml
       services:
         app:
           image: myapp
           environment:
             - NODE_ENV=production
             - API_KEY=123456
       ```

  7. **Ports:**
     - `ports` ánh xạ cổng từ container ra bên ngoài để truy cập dịch vụ.
     - Ví dụ:
       ```yaml
       services:
         web:
           image: nginx
           ports:
             - "8080:80"
       ```

Mỗi phần tử và tùy chọn trong file Docker Compose đều có vai trò và cách cấu hình riêng, giúp bạn dễ dàng thiết lập và quản lý các ứng dụng đa container.


****
- **Kết luận:** Docker Volumes là một phương thức lưu trữ dữ liệu bền vững, giúp giữ lại dữ liệu ngay cả khi container bị xóa hoặc thay thế.

- **Giải thích:**
  
  Docker Volumes là một thành phần quan trọng trong Docker, cho phép bạn lưu trữ dữ liệu bền vững bên ngoài container. Điều này có nghĩa là dữ liệu không bị mất khi container dừng hoặc bị xóa. Dưới đây là một số điểm quan trọng về Docker Volumes:

  1. **Khái niệm cơ bản:**
     - Volumes cho phép bạn lưu trữ dữ liệu trên hệ thống máy chủ dưới dạng một thư mục.
     - Dữ liệu trong volumes có thể được chia sẻ giữa nhiều container.
     - Docker quản lý các volumes này, và bạn không cần biết chính xác nơi lưu trữ của chúng trên hệ thống tệp chủ.

  2. **Cách tạo và sử dụng Docker Volumes:**
     - Để tạo một volume mới, sử dụng lệnh:
       ```bash
       docker volume create my_volume
       ```
     - Để gắn một volume vào container, sử dụng cờ `-v` khi chạy container:
       ```bash
       docker run -d -v my_volume:/data my_image
       ```
       Trong ví dụ này, `my_volume` là tên volume được gắn vào thư mục `/data` bên trong container.

  3. **Ưu điểm của việc sử dụng Volumes:**
     - **Dữ liệu bền vững:** Dữ liệu trong volume vẫn tồn tại ngay cả khi container bị xóa.
     - **Chia sẻ dữ liệu:** Nhiều container có thể truy cập cùng một dữ liệu qua volume.
     - **Di chuyển và sao lưu dễ dàng:** Volumes có thể được sao lưu và di chuyển dễ dàng giữa các máy chủ.

  4. **Quản lý Volumes:**
     - Để liệt kê tất cả các volumes hiện có:
       ```bash
       docker volume ls
       ```
     - Để xóa một volume không còn sử dụng:
       ```bash
       docker volume rm my_volume
       ```

Sử dụng Docker Volumes giúp bạn quản lý dữ liệu hiệu quả trong môi trường container hóa, đặc biệt là trong các ứng dụng cần lưu trữ dữ liệu lâu dài.