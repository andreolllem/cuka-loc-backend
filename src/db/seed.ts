import { query } from "../config/db";
import { hashPassword } from "../utils/password";

async function seed() {
  try {
    await query("TRUNCATE TABLE locacoes RESTART IDENTITY CASCADE");
    await query("TRUNCATE TABLE equipamentos RESTART IDENTITY CASCADE");
    await query("TRUNCATE TABLE usuarios RESTART IDENTITY CASCADE");

    const senhaHash = await hashPassword("senha123");

    const usuarios = await query<{ id: number }>(
      `INSERT INTO usuarios (nome, email, senha, telefone)
       VALUES
         ('Ana Souza', 'ana@agenciacuka.com', $1, '+55 (11) 99999-0000'),
         ('João Lima', 'joao@framehouse.tv', $1, '+55 (21) 98888-1111')
       RETURNING id`,
      [senhaHash]
    );

    if (usuarios.length < 2) {
      throw new Error("Falha ao criar usuários iniciais");
    }

    const [ana, joao] = usuarios;

    await query(
      `INSERT INTO equipamentos (nome, categoria, descricao, preco_diaria, disponibilidade, imagem_url)
       VALUES
         ('Sony FX3 Cinema Line', 'Câmeras', 'Full-frame 4K com codec XAVC S-I e ISO estendido para sets híbridos.', 480.00, true, 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=800&q=60'),
         ('Canon R5 C', 'Câmeras', '8K RAW em corpo compacto com AF Dual Pixel e modo cinema.', 420.00, true, 'https://images.unsplash.com/photo-1484704849700-f032a568e944?auto=format&fit=crop&w=800&q=60'),
         ('DJI Mavic 3 Pro Cine', 'Drones', 'Filmagens aéreas em Apple ProRes com sensor Hasselblad 4/3".', 520.00, true, 'https://images.unsplash.com/photo-1508615070457-7baeba4003a1?auto=format&fit=crop&w=800&q=60'),
         ('Aputure 600D Pro', 'Iluminação', 'LED COB 600W com controle Sidus, ideal para produções externas.', 260.00, true, 'https://images.unsplash.com/photo-1508898578281-774ac4893c0c?auto=format&fit=crop&w=800&q=60'),
         ('Sennheiser AVX Combo', 'Áudio', 'Sistema sem fio digital com XLR plug & play para DSLRs e cinema.', 150.00, true, 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=60'),
         ('DJI RS 4 Pro', 'Estabilizadores', 'Gimbal com autobalance, LiDAR e suporte payload 4.5 kg.', 180.00, true, 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=800&q=60')
      `
    );

    await query(
      `INSERT INTO locacoes (usuario_id, equipamento_id, data_inicio, data_fim, status, valor_total)
       VALUES
         ($1, 1, CURRENT_DATE + 1, CURRENT_DATE + 3, 'confirmada', 1440.00),
         ($2, 4, CURRENT_DATE - 10, CURRENT_DATE - 7, 'concluida', 780.00)`,
      [ana.id, joao.id]
    );

    console.log("🌱 Seed executado com sucesso");
  } catch (error) {
    console.error("Erro ao executar seed", error);
  } finally {
    process.exit(0);
  }
}

seed();
