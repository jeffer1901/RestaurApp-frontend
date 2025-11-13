import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PedidosService {
  private apiUrl: string = `${environment.apiUrl}/pedidos`;

  constructor(private http: HttpClient) {}

  private getAuthHeaders(): HttpHeaders {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return new HttpHeaders();

    const user = JSON.parse(storedUser);
    const token = user.token;

    return new HttpHeaders({
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    });
  }

  // Guardar un pedido nuevo
  guardarPedido(pedido: any): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.post<any>(this.apiUrl, pedido, { headers });
  }

  // Obtener todos los pedidos
  obtenerPedidos(): Observable<any[]> {
    const headers = this.getAuthHeaders();
    return this.http.get<any[]>(this.apiUrl, { headers });
  }

  // Obtener pedido por ID
  obtenerPedidoPorId(id: number): Observable<any> {
    const headers = this.getAuthHeaders();
    return this.http.get<any>(`${this.apiUrl}/${id}`, { headers });
  }
  actualizarEstadoPedido(id: number, nuevoEstado: string) {
    const headers = this.getAuthHeaders();
    return this.http.patch(`${this.apiUrl}/${id}/estado?nuevoEstado=${nuevoEstado}`, null, {
      headers,
      responseType: 'text'
    });
  }
}
